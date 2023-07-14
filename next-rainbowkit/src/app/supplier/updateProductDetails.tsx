import { useState } from "react";

interface Art {
  id: string;
  caption: string;
  description: string;
  image: string;
  price: string;
  quantity: string;
  credentials: string;
}

function UpdateProductDetails() {
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

  const handleAddArt = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDescription("");
    setImage("");
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

  const handleUpdate = () => {
    // Perform the update logic
    // Call the onUpdate function and pass the updated data
    // onUpdate({ description, image, price, credentials, amount });
    // Reset the form fields
    setDescription("");
    setImage("");
    setPrice("");
    setCredentials("");
    setQuantity("");
    // Close the popup
  };

  return (
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
  );
}

export default UpdateProductDetails;
