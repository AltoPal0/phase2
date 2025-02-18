// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WFoundersNFT is ERC721, ERC721Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 25;
    string private baseURI;

    constructor(string memory initialBaseURI) ERC721("WFounders Club", "WFC") Ownable(_msgSender()) {
        baseURI = initialBaseURI;
        _mintBatch(_msgSender(), MAX_SUPPLY);
    }

    function _mintBatch(address recipient, uint256 count) internal {
        for (uint256 i = 1; i <= count; i++) {
            _safeMint(recipient, i);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
    // Only allow minting (to != 0) and burning (to == 0)
        require(to == address(0) || _ownerOf(tokenId) == address(0), "This NFT is soulbound and non-transferable");
        
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
    revert("Approvals are disabled for soulbound NFTs");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Approval for all is disabled for soulbound NFTs");
    }
}