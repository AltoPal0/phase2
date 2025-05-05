// Deployed to 0x09E0a60f12a83ab98Eb9e9CB620bb92D19e4DFAb (POLYGON AMOY)
// Deployed to 0xf55eb9Eeb340d047AE1373c963fF2370a12a1e86 (POLYGON MAINNET)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * One‑contract / many‑events NFT collection.
 * tokenId encoding:  tokenId = (eventId << 64) | attendeeIndex (starting at 1)
 * ‑  eventId:   any uint64 chosen by the organiser (e.g. YYYYMMDD)
 * ‑  attendeeIndex: incremental counter per event
 * Each attendee pays in NEYXT; contract (or relayer) covers POL gas.
 */
contract ClaimableNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using MessageHashUtils for bytes32;

    /* ───── immutable settings ─────────────────────────── */
    IERC20  public wnext;          // NEYXT on Polygon (wrapped)
    address public treasury;       // NEYXT fee receiver
    uint256 public nftPrice;       // price in NEYXT (18 dec)

    /* ───── per‑user / per‑event state ─────────────────── */
    mapping(address => uint256) public nonces;                          // EIP‑191 replay protection
    mapping(uint256 => uint256) private _eventCounters;                 // eventId  → next attendee idx
    mapping(uint256 => mapping(address => bool)) private _claimed;      // eventId  → user → claimed?

    /* ───── constructor ────────────────────────────────── */
    constructor(
        address wnextToken,
        address treasuryAddress,
        uint256 mintPrice,
        address initialOwner
    )
        ERC721("ClubClaimNFT", "CLUB")
        Ownable(initialOwner)
    {
        wnext    = IERC20(wnextToken);
        treasury = treasuryAddress;
        nftPrice = mintPrice;
    }

    /* ───── public mint (gasless via relayer) ──────────── */
    function claimNFTWithSig(
        address   user,
        string   calldata tokenURI_,
        uint256   deadline,
        uint256   eventId,
        bytes    calldata signature
    ) external {
        require(block.timestamp <= deadline, "Signature expired");
        require(!_claimed[eventId][user],     "Already claimed for this event");

        /* ── 1. verify off‑chain signature ─────────────── */
        bytes32 rawHash = keccak256(
            abi.encodePacked(user, tokenURI_, deadline, eventId, nonces[user])
        );
        address signer = ECDSA.recover(rawHash.toEthSignedMessageHash(), signature);
        require(signer == user, "Invalid signature");

        /* ── 2. pull NEYXT fee ─────────────────────────── */
        require(
            wnext.transferFrom(user, treasury, nftPrice),
            "NEYXT payment failed"
        );

        /* ── 3. mint unique token for this event/user ──── */
        uint256 attendeeIdx   = ++_eventCounters[eventId];          // starts at 1
        uint256 tokenId       = (eventId << 64) | attendeeIdx;      // composite ID
        _safeMint(user, tokenId);
        _setTokenURI(tokenId, tokenURI_);                           // keep fully‑custom metadata

        _claimed[eventId][user] = true;
        nonces[user]           += 1;
    }

    /* ───── admin helpers ─────────────────────────────── */
    function updatePrice(uint256 newPrice) external onlyOwner {
        nftPrice = newPrice;
    }

    function updateTreasury(address newTreasury) external onlyOwner {
        treasury = newTreasury;
    }

    /* ───── reject accidental POL/MATIC ───────────────── */
    receive() external payable { revert("No POL accepted"); }
    fallback() external payable { revert("No POL accepted"); }

    /* ───── Required Overrides ────────────────────────── */

   // ───── Required Overrides (OpenZeppelin v5.x) ─────

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // function _burn(uint256 tokenId)
    //     internal
    //     override(ERC721, ERC721URIStorage)
    // {
    //     super._burn(tokenId);
    // }

    function hasClaimed(uint256 eventId, address user) public view returns (bool) {
        return _claimed[eventId][user];
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
}
