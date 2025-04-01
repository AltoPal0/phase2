import { ethers } from "hardhat";

// Deployed to : 0x7F76dE0EA12d38624EEC701009a5575Cb111fC92 (AMOY)

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

  const NFT = await ethers.getContractFactory("ClaimableNFT");
  const nft = await NFT.deploy(
    "0x5911FF908512f9CAC1FC8727dDBfca208F164814", // Latest AMOY
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