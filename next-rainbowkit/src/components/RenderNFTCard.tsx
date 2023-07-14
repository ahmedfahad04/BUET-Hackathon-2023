"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

interface Art {
  id: string;
  caption: string;
  description: string;
  image: string;
  price: string;
  quantity: string;
  credentials: string;
}

interface RenderNFTCardProps {
  searchTerm: string;
}

const RenderNFTCard: React.FC<RenderNFTCardProps> = ({ searchTerm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [credentials, setCredentials] = useState("");
  const [arts, setArts] = useState<Art[]>([]); // Array to store the added arts
  const [caption, setCaption] = useState("");
  const [quantity, setQuantity] = useState("");
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [defaultAccount, setDefaultAccount] = useState(null);

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  let contractAddress = "0x48FEa4f9bbA03d024f9A449F6FB9e36CD1cA5314";

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount: any) => {
    setDefaultAccount(newAccount);
    console.log("newAccount: " + newAccount);
    updateEthers();
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      SupplyChainABI,
      tempSigner
    );
    setContract(tempContract);
  };

  useEffect(() => {
    async function retrieveFiles() {
      // get data from blockchain

      const existingData = JSON.parse(localStorage.getItem("imageData")) || [];
      console.log(existingData.length);

      const newArts = []; // Create a temporary array to store the new arts

      for (let i = 0; i < existingData.length; i++) {
        const data = existingData[i];

        const image = data.image;
        const description = data.description;
        const caption = data.caption;
        const quantity = data.quantity;
        const price = data.price;
        const credentials = data.credentials;

        // console.log(data);

        setImage(image);
        setDescription(description);
        setCaption(description);
        setQuantity(quantity);
        setPrice(price);
        setCredentials(credentials);

        const newArt: Art = {
          id: Date.now().toString(),
          description,
          image,
          price,
          credentials,
          caption,
          quantity,
        };

        newArts.push(newArt); // Add the new art to the temporary array
      }

      setArts([...arts, ...newArts]); // Add all new arts to the existing arts array
    }

    retrieveFiles();
  }, []);

  // Filter arts based on search term
  const filteredArts = arts.filter((art) =>
    art.caption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-wrap ">
      {filteredArts.map((art) => (
        <div
          key={art.id}
          className="p-4 w-full md:w-1/2 lg:w-1/3 transform transition duration-300 hover:scale-105"
        >
          <div className="bg-white border-b-4 border-green-500 rounded-lg shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{art.caption}</h3>
              <div className="flex justify-center items-center">
                <img
                  src={art.image}
                  alt="image"
                  className="h-40 w-40 object-cover rounded-full"
                />
              </div>
              <p className="text-gray-500">Description: {art.description}</p>
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <div>
                <p className="text-gray-500">Price: {art.price}</p>
                <p className="text-gray-500">Quantity: {art.quantity}</p>
              </div>
              <button className="px-6 py-2 text-sm rounded shadow bg-red-100 hover:bg-blue-00 text-blue-500">
                Buy
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderNFTCard;
