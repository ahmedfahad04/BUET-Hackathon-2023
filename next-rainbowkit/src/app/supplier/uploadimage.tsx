// import { createClient } from 'web3.storage';
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import SupplyChainABI from "../../../../contracts/SupplyChainABI.json";

import {
  jsonFile,
  makeGatewayURL,
  showLink,
  showMessage,
} from "../../components/helpers";
import { lstat } from "fs";

const namePrefix = "ImageGallery";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZBNjJjNzlEYWRCNDdkYTJlZEM3NDkxNUJGNTg0MjZhRjNjMjFCNTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODkyNDU0MjY5ODcsIm5hbWUiOiJidWV0In0.IHMOJ2XdTXFIrpx14Zy-pT2g8fgB2lJPr5PEtuCiZoU";
const fetchedImages = [];

export async function getImageMetadata(cid: any) {
  const url = makeGatewayURL(cid, "metadata.json");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `error fetching image metadata: [${res.status}] ${res.statusText}`
    );
  }
  const metadata = await res.json();
  const gatewayURL = makeGatewayURL(cid, metadata.path);
  // const uri = `ipfs://${cid}/${metadata.path}`;
  const uri = `https://${cid}.ipfs.dweb.link/${metadata.path}`;
  return { ...metadata, cid, gatewayURL, uri };
}

export async function* listImageMetadata() {
  if (!token) {
    console.error("No API token for Web3.Storage found.");
    return;
  }

  const web3storage = new Web3Storage({ token });
  for await (const upload of web3storage.list()) {
    if (!upload.name || !upload.name.startsWith(namePrefix)) {
      continue;
    }

    try {
      const metadata = await getImageMetadata(upload.cid);
      console.log("DATA: ", metadata);
      yield metadata;
    } catch (e) {
      console.error("error getting image metadata:", e);
      continue;
    }
  }
}

const saveImageToLocalStorage = (
  image: any,
  caption: any,
  description: any,
  price: any,
  credentials: any,
  quantity: any
) => {
  // Get the existing data from local storage or initialize an empty array
  const existingData = JSON.parse(localStorage.getItem("imageData")) || [];

  // Create a new object with the image and description
  const newData = { image, description, caption, price, credentials, quantity };

  // Add the new object to the existing data array
  existingData.push(newData);

  // Save the updated data back to local storage
  localStorage.setItem("imageData", JSON.stringify(existingData));
};

const getContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    "0x48FEa4f9bbA03d024f9A449F6FB9e36CD1cA5314",
    SupplyChainABI,
    signer
  );
  return contract;
};

export async function UploadImage(
  imageFile: any,
  caption: any,
  description: any,
  price: any,
  credentials: any,
  quantity: any
) {
  // The name for our upload includes a prefix we can use to identify our files later
  const uploadName = [namePrefix, caption].join("|");

  // We store some metadata about the image alongside the image file.
  // The metadata includes the file path, which we can use to generate
  // a URL to the full image.
  const metadataFile = jsonFile("metadata.json", {
    path: imageFile.name,
    caption,
    description,
    price,
    credentials,
    quantity,
  });

  console.log("TOKEN: ", token);
  if (!token) {
    showMessage(
      "> ❗️ no API token found for Web3.Storage. You can add one in the settings page!"
    );
    showLink(`${location.protocol}//${location.host}/settings.html`);
    return;
  }

  const web3storage = new Web3Storage({ token });
  showMessage(`> 🤖 calculating content ID for ${imageFile.name}`);

  // adding to web3.storage returns a cid and a wrapped File
  const cid = await web3storage.put([imageFile, metadataFile], {
    // the name is viewable at https://web3.storage/files and is included in the status and list API responses
    name: uploadName,

    // onRootCidReady will be called as soon as we've calculated the Content ID locally, before uploading
    onRootCidReady: (localCid) => {
      showMessage(`> 🔑 locally calculated Content ID: ${localCid} `);
      showMessage("> 📡 sending files to web3.storage ");
    },

    // onStoredChunk is called after each chunk of data is uploaded
    onStoredChunk: (bytes) =>
      showMessage(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`),
  });

  const metadataGatewayURL = makeGatewayURL(cid, "metadata.json");
  const imageGatewayURL = makeGatewayURL(cid, imageFile.name);
  const imageURI = `https://${cid}.ipfs.dweb.link/${imageFile.name}`;
  const metadataURI = `ipfs://${cid}/metadata.json`;

  // store the metadata in the browser's local storage so we can use it later
  saveImageToLocalStorage(
    imageURI,
    caption,
    description,
    price,
    credentials,
    quantity
  );

  // add data to blockchain
  try {
    const contract = await getContract();
    console.log("CONTRACT: ", contract);
    let blockData = await contract.addArtwork(
      caption,
      description,
      imageURI,
      parseInt(price),
      parseInt(quantity),
      credentials
    );
    blockData.wait();
    console.log("BLOCK DATA: ", blockData);
  } catch (error) {
    console.log("Error adding artwork to blockchain", error);
  }

  return { cid, metadataGatewayURL, imageGatewayURL, imageURI, metadataURI };
}

export default UploadImage;
