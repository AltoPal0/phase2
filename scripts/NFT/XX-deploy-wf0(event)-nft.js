const hre = require("hardhat");

// last run on Sepolia : 0xFa9E810d0D646DDe69fecD7e3282505a7078112f 
//                       0x9Fa2167939B4461BC1caE19349C3bA55841A5D0B
//                       0x5030B57cB8Faf01922F171188B0dC6b9d1E59667
//                       0xa473920d35826761d5e3754f051eB8a5bc0aaEa4

async function main() {
    const baseURI = "https://res.cloudinary.com/ddnwvo0qv/raw/upload/v1739368842/metadata_qzfasq.json"; // Replace with actual metadata URI
    const WF0NFT = await hre.ethers.deployContract("WF0NFT", [baseURI]);

    await WF0NFT.waitForDeployment();
    
    console.log(`✅ Contract deployed at: ${WF0NFT.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});