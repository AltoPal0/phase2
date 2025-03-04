const hre = require("hardhat");

async function main() {
    const contractAddress = "0x5f200aB4e1aCa5cDABDA06dD8079f2EB63Dd01b4";
    // const recipient = "0x1ECbD10b7F3e2c041eb36FA5Cf8F7Fde293AE56f"; // Morgann #001
    // const recipient = "0x25bCfa3253f7d725D648DDe603D77ca6248C3bf5"; // Steph #002
    const recipient = "0x89259C7848da9f9fFE60Fe02c51749A753b19337"; // Karim #003
    const tokenId = 3; // ✅ Manually set the Token ID here

    // Connect to contract
    const WFoundersNFT = await hre.ethers.getContractFactory("WFoundersNFT");
    const contract = await WFoundersNFT.attach(contractAddress);

    console.log(`🚀 Minting NFT #${tokenId} to ${recipient} on contract: ${contractAddress}`);

    try {
        const tx = await contract.safeMint(recipient, tokenId);
        console.log(`⏳ TX Sent: ${tx.hash} - Waiting for confirmation...`);
        await tx.wait();
        console.log(`✅ Successfully Minted Token ID ${tokenId} to ${recipient} - TX: ${tx.hash}`);
    } catch (error) {
        console.error(`❌ Minting Failed for Token ID ${tokenId}:`, error);
    }

    console.log("🎉 Minting Completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Minting Failed:", error);
        process.exit(1);
    });