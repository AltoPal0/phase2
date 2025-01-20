import { ethers } from "hardhat";
import { expect } from "chai";

describe("NEYX VestingWallet", function () {
  it("Should vest tokens over time and release them to the beneficiary", async function () {

    // Deploy NEYX_Token
    const [
      deployer, //Address00
      Address01,
      Address02,
      Address03,
      Address04,
      Address05,
      Address06,
      Address07,
      Address08,
      Address09,
      Address10,
      Address11,
      Address12,
      Address13,
      Address14,
      beneficiary, //Address15
    ] = await ethers.getSigners();

    const initialOwner = deployer; // The address that will own the contract

    const addr_1_Community = Address01;
    const addr_2_Liquidity = Address02;
    const addr_3_1_ReserveFund = Address03;
    const addr_3_2_ReserveFund = Address04;
    const addr_3_3_0_ReserveFund = Address05;
    const addr_3_3_1_ReserveFund = Address06;
    const addr_3_3_2_ReserveFund = Address07;
    const addr_3_4_ReserveFund = Address08;
    const addr_4_1_MarketingPartners = Address09;
    const addr_4_2_MarketingPartners = Address10;
    const addr_4_3_MarketingPartners = Address11;
    const addr_5_1_TeamAdvisors = Address12;
    const addr_5_2_TeamAdvisors = Address13;
    const addr_5_3_TeamAdvisors = Address14;

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
      addr_5_3_TeamAdvisors,
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

    const NEYX_Token_Factory = await ethers.getContractFactory("NEYX_Token");
    const token = await NEYX_Token_Factory.deploy(
      initialOwner,
      initialWallets,
      initialBalances
    );

    // NEYX Vesting -----------
    // Transfer all tokens from addr_3_3_0_ReserveFund to NEYXVestingWallet
    const reserveFundBalance = await token.balanceOf(addr_3_3_0_ReserveFund.address);

    // Deploy NEYXVestingWallet
    const now = Math.floor(Date.now() / 1000);
    const duration = 60 * 60 * 24 * 30; // 30 days

    const VestingWallet = await ethers.getContractFactory("NEYXVestingWallet");
    const vestingWallet = await VestingWallet.deploy(
      beneficiary.address, // Beneficiary address
      now,                 // Vesting start time
      duration             // Vesting duration in seconds
    );
    await vestingWallet.waitForDeployment();

    // Transfer tokens from addr_3_3_0_ReserveFund to VestingWallet
    await token
      .connect(addr_3_3_0_ReserveFund)
      .transfer(vestingWallet.getAddress(), reserveFundBalance);

    // Verify transfer to VestingWallet
    expect(await token.balanceOf(vestingWallet.getAddress())).to.equal(reserveFundBalance);

    // Verify addr_3_3_0_ReserveFund has a zero balance
    expect(await token.balanceOf(addr_3_3_0_ReserveFund.address)).to.equal(0);

    // Check that beneficiary cannot withdraw immediately
    await expect(
        vestingWallet["release(address)"](token.getAddress())
    ).to.be.revertedWith("VestingWallet: no tokens are due");

    // Fast-forward 15 days
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]); // 15 days
    await ethers.provider.send("evm_mine", []);

    // Partial release after 15 days
    await vestingWallet["release(address)"](token.getAddress())
    const released = await token.balanceOf(beneficiary.address);

    const expectedReleased = reserveFundBalance / 2n; // 50% released
    expect(released).to.be.closeTo(expectedReleased, ethers.parseUnits("1", 18));

    // Fast-forward to the end of the vesting period
    await ethers.provider.send("evm_increaseTime", [15 * 24 * 60 * 60]); // Another 15 days
    await ethers.provider.send("evm_mine", []);

    // Release remaining tokens
    await vestingWallet["release(address)"](token.getAddress())
    const finalBalance = await token.balanceOf(beneficiary.address);
    expect(finalBalance).to.equal(reserveFundBalance); // Full amount vested
  });
});