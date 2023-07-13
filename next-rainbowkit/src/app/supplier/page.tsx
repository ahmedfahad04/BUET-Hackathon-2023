"use client";
import { RainbowSDK } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

const ArtGallery: React.FC = () => {
  const [arts, setArts] = useState<string[]>([]); // Array to store the added arts
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      const isConnected = await RainbowSDK.isConnected();
      setIsWalletConnected(isConnected);
    };

    checkWalletConnection();
  }, []);

  const handleAddArt = () => {
    // In this example, we are simply generating a random ID for the added art
    const artId = Math.random().toString(36).substring(7);
    setArts([...arts, artId]);
  };

  const connectWallet = async () => {
    try {
      await RainbowSDK.connect();
      setIsWalletConnected(true);
      console.log("Wallet connected");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="bg-cyan-500 h-screen">
      <div>
        <div className="mb-4 flex justify-center items-center p-5">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded "
            onClick={handleAddArt}
          >
            Add Art
          </button>
        </div>
        <div className="flex flex-wrap">
          {arts.map((artId) => (
            <div key={artId} className="p-4 w-full md:w-1/2 lg:w-1/3">
              <div className="bg-white border rounded-lg shadow-lg">
                {/* Art Card Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">Art Title</h3>
                  <p className="text-gray-500">Art Description</p>
                  {/* Additional details can be added here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtGallery;
