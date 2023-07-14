import { useState } from "react";
import RenderNFTCard from "./RenderNFTCard";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search term change
  const handleSearchTermChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-gradient-to-b from-purple-500 to-blue-500 min-h-screen ">
      <div className="py-16 px-8 sm:px-12 lg:px-24 ">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold">
            Welcome to the NFT Marketplace
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white mt-4">
            Explore, Collect, and Trade Unique Digital Assets
          </p>
        </div>
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search for NFTs"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full py-2 px-4 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="transform transition duration-300 hover:scale-105">
          <RenderNFTCard searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default Home;
