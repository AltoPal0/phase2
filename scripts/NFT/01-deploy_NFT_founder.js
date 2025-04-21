const hre = require("hardhat");

// Last runs
// 0xc01e9aA87e63e7341dA6eC805478843919Ab9670
// 0xD3aa654F9cBA7A8cdD674125742a62342aAa5eBB
// 0x86b8B002ff72Be60C63E9Ae716348EDC1771F52e - Polygon Amoy
// 0xB066f1a3354Fc646040EEC8732539e091eF3d8Ef - Amoy
// 0x86b8B002ff72Be60C63E9Ae716348EDC1771F52e - Polygon Mainnet
// 0x5f200aB4e1aCa5cDABDA06dD8079f2EB63Dd01b4 - Polygon Mainnet
// 0x565C1EC76d5EC7B3E41E49eC57e9dBc05E37C9Cf - Amoy latest

// 0xE6C36094B8BFB325BA42A3448174e947a0f51E17 - Polygon Mainnet V01 <<<<


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