// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// Deployed to : 0x7F76dE0EA12d38624EEC701009a5575Cb111fC92 (AMOY)

contract ClaimableNFT is ERC721URIStorage, Ownable {
    using MessageHashUtils for bytes32;

    IERC20 public wnext;
    address public treasury;
    uint256 public nftPrice; // in WNEXT
    uint256 public tokenIdCounter;
    mapping(address => uint256) public nonces;
    mapping(uint256 => mapping(address => bool)) public hasClaimed; // eventId => user => claimed

    constructor(
        address wnextToken,
        address treasuryAddress,
        uint256 mintPrice,
        address initialOwner
    )
        ERC721("ClubClaimNFT", "CLUB")
        Ownable(initialOwner) // <- pass the owner explicitly
    {
        wnext = IERC20(wnextToken);
        treasury = treasuryAddress;
        nftPrice = mintPrice;
    }

    function claimNFTWithSig(
        address user,
        string calldata tokenURI,
        uint256 deadline,
        uint256 eventId,
        bytes calldata signature
    ) external {
        require(block.timestamp <= deadline, "Signature expired");
        require(!hasClaimed[eventId][user], "Already claimed for this event");

        bytes32 rawHash = keccak256(
            abi.encodePacked(user, tokenURI, deadline, eventId, nonces[user])
        );
        bytes32 messageHash = rawHash.toEthSignedMessageHash();
        address signer = ECDSA.recover(messageHash, signature);
        require(signer == user, "Invalid signature");

        require(wnext.transferFrom(user, treasury, nftPrice), "WNEXT payment failed");

        uint256 newTokenId = ++tokenIdCounter;
        _mint(user, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        hasClaimed[eventId][user] = true;
        nonces[user] += 1;
    }

    function updatePrice(uint256 _newPrice) external onlyOwner {
        nftPrice = _newPrice;
    }

    function updateTreasury(address _newTreasury) external onlyOwner {
        treasury = _newTreasury;
    }

    receive() external payable {
        revert("This contract does not accept POL");
    }

    fallback() external payable {
        revert("This contract does not accept POL");
    }
}
