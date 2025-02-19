const hre = require("hardhat");

// Last runs
// 0xc01e9aA87e63e7341dA6eC805478843919Ab9670
// 0xD3aa654F9cBA7A8cdD674125742a62342aAa5eBB

async function main() {
    // Define the base URI pointing to your metadata API
    const initialBaseURI = "https://wfounders.club/api/metadata/";

    console.log("Deploying WFoundersNFT contract...");

    // Get contract factory
    const WFoundersNFT = await hre.ethers.getContractFactory("WFoundersNFT");

    // Deploy contract with initial baseURI
    const contract = await WFoundersNFT.deploy(initialBaseURI);

    // Wait for deployment
    await contract.waitForDeployment();

    // Log contract address
    console.log("WFoundersNFT deployed to:", await contract.getAddress());
}

// Execute deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });