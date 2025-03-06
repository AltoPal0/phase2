// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Last runs
// 0x19fB0271e0F0380645b15C409e43e92F8774b5F1 -- Removed soulbound

contract WFoundersNFT is ERC721, ERC721Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000;
    string private baseURI;

    constructor(string memory initialBaseURI) ERC721("WFounders Club", "WFC") Ownable(_msgSender()) {
        baseURI = initialBaseURI;
    }

    function safeMint(address recipient, uint256 tokenId) public onlyOwner {
        require(tokenId > 0 && tokenId <= MAX_SUPPLY, "Invalid token ID");
        require(_ownerOf(tokenId) == address(0), "Token already minted");

        _safeMint(recipient, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    //     require(to == address(0) || _ownerOf(tokenId) == address(0) || auth == owner(), 
    //         "This NFT is soulbound and non-transferable");

    //     return super._update(to, tokenId, auth);
    // }

    // function approve(address, uint256) public pure override {
    //     revert("Approvals are disabled for soulbound NFTs");
    // }

    // function setApprovalForAll(address, bool) public pure override {
    //     revert("Approval for all is disabled for soulbound NFTs");
    // }
}