const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Last run on sepolia : 
  // NEYXT Token deployed to: 0xf55eb9Eeb340d047AE1373c963fF2370a12a1e86
  const initialOwner = "0x34FD675B1CFf93031F0B80ed837c063952aCCB1f"; // The address that will own the contract
  

  const addr_1_Community = "0x1134Bb07cb7F35946E7e02f58cA7fcC64698B59b";

  const addr_2_Liquidity = "0x99Bb88cbC2A1D0B12f3BA63Cd51aC919B7601179";

  const addr_3_1_ReserveFund = "0x82c5e1812079FE89bD8240c924592a1DC13BAd18";
  const addr_3_2_ReserveFund = "0x90730d044Ccd332f5a23844F7E219d2CF0AC467C";

  const addr_3_3_0_ReserveFund = "0x89691BaF004bf4A7D9Ce265d47903D3595996Ad7";
  const addr_3_3_1_ReserveFund = "0x7Abb72de1cea2C7319338417537f23977dE9c111";
  const addr_3_3_2_ReserveFund = "0x33D05F773131Acc38A605506953cE8c1b4580AC0";

  const addr_3_4_ReserveFund = "0x739D97D7862062B6d14d9998c9513f7922d22A45";

  const addr_4_1_MarketingPartners = "0x68eEB5992bDBf53Ead548E80E59cFCb26bEca892";
  const addr_4_2_MarketingPartners = "0x9B273a89fe6EE30bD568856A169895C4E1e264d1";
  const addr_4_3_MarketingPartners = "0x8F13AF490425D40cA3179E4fa5D6847FcCCd85d6";

  const addr_5_1_TeamAdvisors = "0x76E871415906652F268Ae45348564bB0194a65Ee";
  const addr_5_2_TeamAdvisors = "0xe8c5E2dd21aaEc34575C2b5FF23708E2616AECd7";
  const addr_5_3_TeamAdvisors = "0x4bf431e37539B8528f176B46CFd627699861df58";

  const initialWallets = [

    addr_1_Community,

    addr_2_Liquidity,

    addr_3_1_ReserveFund,
    addr_3_2_ReserveFund,

    addr_3_3_0_ReserveFund,
    addr_3_3_1_ReserveFund,
    addr_3_3_2_ReserveFund,

    addr_3_4_ReserveFund,

    addr_4_1_MarketingPartners,
    addr_4_2_MarketingPartners,
    addr_4_3_MarketingPartners,

    addr_5_1_TeamAdvisors,
    addr_5_2_TeamAdvisors,
    addr_5_3_TeamAdvisors

  ]; // Wallet addresses to receive tokens
  const initialBalances = [
    ethers.parseUnits("300000000", 18), // 300 million tokens // addr_1_Community,
    ethers.parseUnits("300000000", 18), // 300 million tokens // addr_2_Liquidity,
    ethers.parseUnits("50000000", 18), //addr_3_1_ReserveFund
    ethers.parseUnits("10000000", 18), //addr_3_2_ReserveFund,
    ethers.parseUnits("8571428", 18), //addr_3_3_0_ReserveFund,
    ethers.parseUnits("7142858", 18), //addr_3_3_1_ReserveFund,
    ethers.parseUnits("14285714", 18), //addr_3_3_2_ReserveFund,
    ethers.parseUnits("10000000", 18), //addr_3_4_ReserveFund,
    ethers.parseUnits("10000000", 18), //addr_4_1_MarketingPartners,
    ethers.parseUnits("10000000", 18), //addr_4_2_MarketingPartners,
    ethers.parseUnits("30000000", 18), //addr_4_3_MarketingPartners,
    ethers.parseUnits("50000000", 18), //addr_5_1_TeamAdvisors,
    ethers.parseUnits("50000000", 18), //addr_5_2_TeamAdvisors,
    ethers.parseUnits("150000000", 18), //addr_6_0_OtherReserves
  ]; // Token balances corresponding to wallets

  // Check initial wallet and balance length
  if (initialWallets.length !== initialBalances.length) {
    throw new Error("Wallets and balances length mismatch");
  }

  // Get the contract factory
  const NEYX_Token = await ethers.getContractFactory("NEYX_Token");

  // Deploy the contract
  const neyxToken = await NEYX_Token.deploy(initialOwner, initialWallets, initialBalances);

  // Wait for deployment to complete
  await neyxToken.waitForDeployment();
  console.log("NEYXT Token deployed to:", await neyxToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });