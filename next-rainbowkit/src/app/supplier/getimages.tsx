import { Web3Storage } from "web3.storage";
import { makeGatewayURL } from "../../components/helpers";

const namePrefix = "ImageGallery";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEZBNjJjNzlEYWRCNDdkYTJlZEM3NDkxNUJGNTg0MjZhRjNjMjFCNTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODkyNDU0MjY5ODcsIm5hbWUiOiJidWV0In0.IHMOJ2XdTXFIrpx14Zy-pT2g8fgB2lJPr5PEtuCiZoU";

const fetchedImages: any[] = [];
const loadImages = (imgData: any) => {
  fetchedImages.push(imgData);
};

export const getImages = () => {
  console.log("DAT: ", fetchedImages);
  return fetchedImages;
};

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
  const uri = `ipfs://${cid}/${metadata.path}`;
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
      loadImages(metadata);
      yield metadata;
    } catch (e) {
      console.error("error getting image metadata:", e);
      continue;
    }
  }
}
