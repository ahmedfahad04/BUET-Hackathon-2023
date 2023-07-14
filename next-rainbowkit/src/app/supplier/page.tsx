"use client";

import { ethers } from "ethers";
import { SetStateAction, useEffect, useState } from "react";
import SupplyChainABI from "../../../../contracts/SupplyChainABI.json";
import UploadImage from "./uploadimage";

interface Art {
  id: string;
  caption: string;
  description: string;
  image: string;
  price: string;
  quantity: string;
  credentials: string;
}

const ArtGallery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [credentials, setCredentials] = useState("");
  const [arts, setArts] = useState<Art[]>([]); // Array to store the added arts
  const [caption, setCaption] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); // State to track supplier registration
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  let contractAddress = "0xc5316fe8E5d02eA8f02799254E267EC01f1F90DE";

  const handleAddArt = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDescription("");
    setImage(null);
    setPrice("");
    setCredentials("");
    setCaption("");
    setQuantity("");
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // UploadImage(event.target.files[0], description);
      setImage(event.target.files[0]);
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleCredentialsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(event.target.value);
  };

  const handleConfirm = async () => {
    // Create a new art object with the form data
    const newArt: Art = {
      id: Date.now().toString(),
      description,
      image,
      price,
      credentials,
      caption,
      quantity,
    };

    // Add the new art to the arts array
    setArts([...arts, newArt]);

    // Save the image and description to local storage
    await UploadImage(
      image,
      caption,
      description,
      price,
      credentials,
      quantity
    );

    handleModalClose();
  };

  const connectWalletHandler = () => {
    console.log("connectWalletHandler");
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (result: any[]) => {
          let val = await contract.registerSupplier();
          val.wait();
          console.log("VAL: " + val);

          accountChangedHandler(result[0]);
          setCurrentContractVal(result[0]);

          console.log("Wallet Connected");
          setIsRegistered(true);
        })
        .catch((error: { message: SetStateAction<null> }) => {
          console.log(error.message);
          console.log("Wallet Connection Failed");
          setIsRegistered(true);
        });
    } else {
      console.log("Need to install MetaMask");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount: any) => {
    setDefaultAccount(newAccount);
    console.log("newAccount: " + newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

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

  useEffect(() => {
    async function retrieveFiles() {
      // get data from blockchain

      const contract = await getContract();
      let artworkData = await contract.fetchArtworks();
      console.log("ARK: " + artworkData);

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

  return (
    <div className="bg-cyan-400 p-4 h-screen">
      {!isRegistered && (
        <div className="mb-4 flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded text-white text-xl p-3 font-bold"
            onClick={connectWalletHandler}
          >
            Register as Supplier
          </button>
        </div>
      )}
      {isRegistered && (
        <div>
          <div className="mb-4 flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddArt}
            >
              Add Art
            </button>
          </div>
          {isModalOpen && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md">
                <h2 className="text-xl font-bold mb-4">Add Art</h2>

                <div className="mb-4">
                  <label htmlFor="caption">Caption:</label>
                  <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={handleCaptionChange}
                    required
                    className="bg-gray-100 p-2 rounded-md w-full"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                    className="bg-gray-100 p-2 rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="image">Image:</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="price">Price:</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    className="bg-gray-100 p-2 rounded-md w-full"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    required
                    className="bg-gray-100 p-2 rounded-md w-full"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="credentials">
                    Artist/Creator Credentials:
                  </label>
                  <input
                    type="text"
                    id="credentials"
                    value={credentials}
                    onChange={handleCredentialsChange}
                    required
                    className="bg-gray-100 p-2 rounded-md w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-center">
            {arts.map((art) => (
              <div
                key={art.id}
                className="p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
              >
                <div className="bg-white border-b-4 border-green-500 rounded-lg shadow-lg">
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{art.caption}</h3>
                    <div className="flex justify-center items-center">
                      <img
                        src={art.image}
                        alt="image"
                        className="h-40 w-40 object-cover rounded-md"
                      />
                    </div>
                    <p className="text-gray-500 text-xl p-3 justify-center items-center flex bg-green-200 m-2">
                      Description: {art.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex">
                      <p className="text-gray-900 bg-yellow-400 flex justify-center items-center p-2 rounded-md mr-2">
                        Price: {art.price}
                      </p>
                      <p className="text-gray-900 bg-blue-400 flex justify-center items-center p-2 rounded-md">
                        Quantity: {art.quantity}
                      </p>
                    </div>
                    <button className="bold px-6 py-2 text-lg rounded-full shadow bg-red-300 hover:bg-red-600 text-grey-500">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtGallery;
