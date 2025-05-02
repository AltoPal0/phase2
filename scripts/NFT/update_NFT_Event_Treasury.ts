import { ethers } from "hardhat";

async function main() {
    const CONTRACT_ADDRESS = "0x064412f251Dc5D8D927fe31CE4332f5A27592F97"; // ClaimableNFT
    const NEW_TREASURY = "0x68eEB5992bDBf53Ead548E80E59cFCb26bEca892"; //NEYX - 9 - WF

    // Minimal ABI for this task
    const ABI = [
        "function updateTreasury(address newTreasury) external",
        "function treasury() view returns (address)"
    ];

    const [deployer] = await ethers.getSigners();
    console.log(`Using signer: ${deployer.address}`);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, deployer);

    const currentTreasury = await contract.treasury();
    console.log(`Current treasury: ${currentTreasury}`);

    if (currentTreasury.toLowerCase() === NEW_TREASURY.toLowerCase()) {
        console.log("⚠️  New treasury is the same as current. No update needed.");
        return;
    }

    const tx = await contract.updateTreasury(NEW_TREASURY);
    console.log(`Tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Treasury updated in block ${receipt.blockNumber}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});