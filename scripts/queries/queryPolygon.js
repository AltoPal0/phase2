const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
const contractAddress = "0x86b8B002ff72Be60C63E9Ae716348EDC1771F52e";
const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];
const contract = new ethers.Contract(contractAddress, abi, provider);

async function fetchTokenURI(tokenId) {
    const uri = await contract.tokenURI(tokenId);
    console.log("Metadata URL:", uri);
}

fetchTokenURI(1);