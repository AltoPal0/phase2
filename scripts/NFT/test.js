const { ethers } = require("hardhat");

async function main() {
    // ✅ Define your NFT contract address & token ID
    const CONTRACT_ADDRESS = "0xa473920d35826761d5e3754f051eB8a5bc0aaEa4"; // Your NFT contract
    const TOKEN_ID = "1"; // The token ID you want to check


    // ✅ Get signer & provider (uses Hardhat network settings)
    const [deployer] = await ethers.getSigners();
    console.log(`🔹 Using account: ${deployer.address}`);

    // ✅ Connect to the deployed contract
    const contract = await ethers.getContractAt(
        ["function tokenURI(uint256) view returns (string)"], // ABI (only tokenURI function)
        CONTRACT_ADDRESS
    );

    // ✅ Call tokenURI() function
    console.log(`🔹 Fetching tokenURI for Token ID: ${TOKEN_ID}`);
    const uri = await contract.tokenURI(TOKEN_ID);

    console.log("✅ Token URI:", uri);

    // ✅ Check if the URI is a valid URL
    if (uri.startsWith("http") || uri.startsWith("ipfs://")) {
        console.log("✅ The metadata is hosted correctly.");
        console.log("🔗 Open in browser:", uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
    } else {
        console.error("❌ Invalid Token URI. Make sure your smart contract is returning a valid URL.");
    }
}

// ✅ Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });