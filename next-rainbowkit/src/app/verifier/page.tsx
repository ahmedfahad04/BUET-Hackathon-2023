"use client";
import { ethers } from "ethers";
import { SetStateAction, useEffect, useState } from "react";
import SupplyChainABI from "../../../../contracts/SupplyChainABI.json";

interface Art {
  id: string;
  caption: string;
  description: string;
  image: string;
  price: string;
  quantity: string;
  credentials: string;
}

const VerifierWindow: React.FC = () => {
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

  // const getContract = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(
  //     "0x48FEa4f9bbA03d024f9A449F6FB9e36CD1cA5314",
  //     SupplyChainABI,
  //     signer
  //   );
  //   return contract;
  // };

  const connectWalletHandler = () => {
    console.log("connectWalletHandler");
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(async (result: any[]) => {
          let val = await contract.registerVerifier();
          val.wait();
          console.log("VAL: " + val);

          accountChangedHandler(result[0]);
          setCurrentContractVal(result[0]);

          console.log("Wallet Connected");
          // setIsRegistered(true);
        })
        .catch((error: { message: SetStateAction<null> }) => {
          console.log(error.message);
          console.log("Wallet Connection Failed");
          // setIsRegistered(true);
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

  const VerifierHero = () => {
    return (
      <div className="hero-section bg-gradient-to-r from-yellow-500 to-cyan-500 h-48 flex flex-col items-center justify-center">
        <h1 className="hero-text text-white text-4xl font-bold">
          Verify Artworks
        </h1>
        <button
          onClick={connectWalletHandler}
          className="register-button bg-gradient-to-r from-cyan-500 to-yellow-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded mt-4 border-2 "
        >
          Register Verifier
        </button>
      </div>
    );
  };

  const verifyArtwork = async (artist_addr: any, artwork_id: any) => {
    // Perform the desired task on submit
    console.log("Submit button clicked");
    let val = await contract.issueCertificate(artist_addr, artwork_id);
    // Add your logic here
  };

  useEffect(() => {
    const ShowArtworks = () => {
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

        console.log(data);

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

      console.log("ARTS:" + arts);
    };

    ShowArtworks();
  }, []);

  return (
    <div>
      <VerifierHero />
      <div className="flex flex-wrap justify-center">
        {arts.map((art) => (
          <div key={art.id} className="p-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
            <div className="bg-white border rounded-lg shadow-lg">
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
                <button
                  className="px-6 py-2 text-sm rounded shadow bg-blue-100 hover:bg-blue-500 text-grey-500"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifierWindow;
