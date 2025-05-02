import { ethers } from "hardhat";

// Deployed to : 0x2F0B50dF9E7B8B2bf4b46ccFd8d67431349Bc8c9 (AMOY)

const NEYXT_Address = "0x5911FF908512f9CAC1FC8727dDBfca208F164814";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

//   const totalSupply = ethers.parseUnits("1000000000", 18);

//   const NEYXT = await ethers.getContractFactory("NEYX_Token");
//   const neyxt = await NEYXT.deploy(
//     deployer.address,
//     [deployer.address],
//     [totalSupply]
//   );
//   await neyxt.waitForDeployment();
//   console.log("NEYXT deployed to:", await neyxt.getAddress());

// ✅ Expected tokenURI format (used at mint time via backend):
// Example: "https://your-backend.com/api/dev/claim/metadata.json?uri=20250401001"
//          where "20250401" = date, "001" = organizer ID

  const NFT = await ethers.getContractFactory("ClaimableNFT");
  const nft = await NFT.deploy(
    NEYXT_Address, // Latest AMOY
    deployer.address,
    ethers.parseUnits("1000", 18),
    deployer.address
  );
  await nft.waitForDeployment();
  console.log("NFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});