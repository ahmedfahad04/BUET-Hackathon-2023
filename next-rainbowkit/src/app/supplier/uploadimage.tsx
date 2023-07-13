// import { createClient } from 'web3.storage';
import { Web3Storage } from "web3.storage";

import {
  getSavedToken,
  jsonFile,
  makeGatewayURL,
  showLink,
  showMessage,
} from "../../components/helpers";

export async function UploadImage(imageFile: any, caption: any) {
  const namePrefix = "ImageGallery";

  // The name for our upload includes a prefix we can use to identify our files later
  const uploadName = [namePrefix, caption].join("|");

  // We store some metadata about the image alongside the image file.
  // The metadata includes the file path, which we can use to generate
  // a URL to the full image.
  const metadataFile = jsonFile("metadata.json", {
    path: imageFile.name,
    caption,
  });

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZBNjJjNzlEYWRCNDdkYTJlZEM3NDkxNUJGNTg0MjZhRjNjMjFCNTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODkyNDU0MjY5ODcsIm5hbWUiOiJidWV0In0.IHMOJ2XdTXFIrpx14Zy-pT2g8fgB2lJPr5PEtuCiZoU"
  console.log("TOKEN: ",token);
  if (!token) {
    showMessage(
      "> ❗️ no API token found for Web3.Storage. You can add one in the settings page!"
    );
    showLink(`${location.protocol}//${location.host}/settings.html`);
    return;
  }

  const web3storage = new Web3Storage({ token });
  showMessage(`> 🤖 calculating content ID for ${imageFile.name}`);
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
  const imageURI = `ipfs://${cid}/${imageFile.name}`;
  const metadataURI = `ipfs://${cid}/metadata.json`;
  return { cid, metadataGatewayURL, imageGatewayURL, imageURI, metadataURI };
}

export default UploadImage;
