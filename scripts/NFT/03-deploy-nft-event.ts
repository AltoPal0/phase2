import { ethers } from "hardhat";
import readline from "readline";

// Simple helper to prompt user for input
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with:", deployer.address);

    // ✅ Prompt the user for the NEYXT token address
    const neyxtAddress = (await askQuestion("Enter the NEYXT token address (e.g., 0x...): ")).trim();

    if (!ethers.isAddress(neyxtAddress)) {
        throw new Error("Invalid NEYXT address provided.");
    }

    const nftPrice = ethers.parseUnits("1000", 18);

    const NFT = await ethers.getContractFactory("ClaimableNFT");
    const nft = await NFT.deploy(
        neyxtAddress,
        deployer.address,
        nftPrice,
        deployer.address
    );
    await nft.waitForDeployment();
    console.log("✅ NFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});