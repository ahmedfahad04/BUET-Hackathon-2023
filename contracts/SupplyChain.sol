// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SupplyChain is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("SupplyChain", "SCA") {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(address to) public returns (uint256) {
        require(verifiers[msg.sender] == true, "!!!Not a verifier!!!");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

    function issueCertificate(address artist, uint256 artworkId) public {
        Artwork storage _artwork = artworks[artworkId];
        require(_artwork.tokenId == 0, "!!!Certificate already issued!!!");
        uint256 tokenId = safeMint(artist);
        _artwork.tokenId = tokenId;
    }

    function verifyOwner(address artist, uint256 tokenId)
        public
        view
        returns (bool)
    {
        require(verifiers[msg.sender] == false, "!!!Not a buyer!!!");
        require(suppliers[msg.sender] == false, "!!!Not a buyer!!!");

        if (ownerOf(tokenId) == artist) return true;
        return false;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    mapping(address => bool) suppliers;
    mapping(address => bool) verifiers;

    struct Artwork {
        string name;
        string description;
        string imageHash;
        uint256 price;
        uint256 quantity;
        address artistCredentials;
        address supplier;
        uint256 tokenId;
    }

    address[] public artistAddresses;

    struct Order {
        address seller;
        address buyer;
        string status;
        uint256 product_id;
        uint256 price;
    }

    mapping(uint256 => Artwork) public artworks;
    mapping(uint256 => Order) public orders;

    uint256 public artworkCount;
    uint256 public orderCount;

    function registerSupplier() public {
        require(
            suppliers[msg.sender] == false,
            "!!!Supplier already registered!!!"
        );
        suppliers[msg.sender] = true;
    }

    function registerVerifier() public {
        require(
            verifiers[msg.sender] == false,
            "!!!Verifier already registered!!!"
        );
        verifiers[msg.sender] = true;
    }

    function addArtwork(
        string memory _name,
        string memory _description,
        string memory _imageHash,
        uint256 _price,
        uint256 _quantity,
        address _artistCredentials
    ) public {
        require(suppliers[msg.sender] == true, "!!!Supplier not registered!!!");

        uint256 artworkId = artworkCount;

        artworks[artworkId] = Artwork({
            name: _name,
            description: _description,
            imageHash: _imageHash,
            price: _price,
            quantity: _quantity,
            artistCredentials: _artistCredentials,
            supplier: msg.sender,
            tokenId: 0
        });

        artworkCount++;
    }

    function updateQuantity(uint256 artworkIndex, uint256 updatedQuantity)
        public
    {
        Artwork storage orderArtwork = artworks[artworkIndex];
        orderArtwork.quantity = updatedQuantity;
    }

    function fetchArtworks() public view returns (Artwork[] memory) {
        Artwork[] memory allArtworks = new Artwork[](artworkCount);
        for (uint256 i = 0; i < artworkCount; i++) {
            allArtworks[i] = artworks[i];
        }
        return allArtworks;
    }

    function placeOrder(uint256 artworkIndex) public {
        Artwork storage orderArtwork = artworks[artworkIndex];
        require(orderArtwork.quantity > 0, "Product is out of stock");
        orders[orderCount] = Order({
            seller: orderArtwork.supplier,
            buyer: msg.sender,
            price: orderArtwork.price,
            product_id: artworkIndex,
            status: "PENDING"
        });
        orderCount++;
        orderArtwork.quantity--;
    }

    function confirmOrder(uint256 orderIndex) external payable {
        require(orders[orderIndex].buyer == msg.sender, "Only buyer can pay");
        require(
            keccak256(bytes(orders[orderIndex].status)) ==
                keccak256(bytes("PENDING")),
            "Payment already done"
        );
        require(
            orders[orderIndex].price == msg.value,
            "Please pay the full price"
        );

        address payable seller = payable(orders[orderIndex].seller);
        seller.transfer(msg.value);
        orders[orderIndex].status = "CONFIRMED";
    }

    function viewOrderStatus(uint256 orderIndex)
        public
        view
        returns (string memory)
    {
        return (orders[orderIndex].status);
    }

    // function placeOrder ()
}
