const hre = require("hardhat");

async function main() {
    // Replace with your deployed contract address
    const contractAddress = "0xD3aa654F9cBA7A8cdD674125742a62342aAa5eBB";
    
    // List of addresses to mint NFTs to
    const recipients = [
        "0x054131B1EE0c96b5c9EbC6217F4f5E072c0E03C6",
        "0x25bCfa3253f7d725D648DDe603D77ca6248C3bf5"
    ];

    // Connect to contract
    const WFoundersNFT = await hre.ethers.getContractFactory("WFoundersNFT");
    const contract = await WFoundersNFT.attach(contractAddress);

    console.log(`Minting NFTs on contract: ${contractAddress}`);

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const tokenId = i + 1; // Assign token IDs sequentially
        
        console.log(`Minting NFT #${tokenId} to ${recipient}...`);

        const tx = await contract.safeMint(recipient, tokenId);
        await tx.wait();

        console.log(`✅ Minted Token ID ${tokenId} to ${recipient} - TX: ${tx.hash}`);
    }

    console.log("🎉 All NFTs Minted Successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Minting Failed:", error);
        process.exit(1);
    });