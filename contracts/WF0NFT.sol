// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WF0NFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;  // Keeps track of minted NFTs
    string private _baseTokenURI;  // Stores metadata URL

    constructor(string memory initialBaseURI) ERC721("WF0NFT", "WF0") Ownable(msg.sender) {
        _baseTokenURI = initialBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function mintTo(address recipient) external onlyOwner {
        _tokenIdCounter++;
        _safeMint(recipient, _tokenIdCounter);
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "WF0NFT: Token does not exist");
        return _baseTokenURI;
    }
}