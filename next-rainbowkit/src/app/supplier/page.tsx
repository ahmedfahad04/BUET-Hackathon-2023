"use client";

import { useEffect, useState } from "react";
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
  const [imgObj, setImgObj] = useState<any>([]);

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

  useEffect(() => {
    async function retrieveFiles() {
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
    }

    retrieveFiles();
  }, []);

  return (
    <div className="bg-cyan-400 h-screen">
      <div className="mb-4 p-5 justify-center items-center">
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
              <label htmlFor="credentials">Artist/Creator Credentials:</label>
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

      <div className="flex flex-wrap">
        {arts.map((art) => (
          <div key={art.id} className="p-4 w-full md:w-1/2 lg:w-1/3">
            <div className="bg-white border rounded-lg shadow-lg h-500">
              <div className="h-full flex flex-col justify-between">
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{art.caption}</h3>
                  <div className="flex justify-center items-center h-300">
                    <img src={art.image} alt="image" className="h-300 w-300" />
                  </div>
                  <p className="text-gray-500">
                    Description: {art.description}
                  </p>
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                  <div>
                    <p className="text-gray-500">Price: {art.price}</p>
                    <p className="text-gray-500">Quantity: {art.quantity}</p>
                  </div>
                  <button className="btn-buy">Buy</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of the component */}
    </div>
  );
};

export default ArtGallery;
