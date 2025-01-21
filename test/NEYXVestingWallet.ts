import { ethers } from "hardhat";
import { expect } from "chai";

function formatBalance(balance: any) {
  const fullTokens = BigInt(balance) / BigInt(1e18); // Convert from Wei to full tokens
  return new Intl.NumberFormat("en-US").format(fullTokens); // Format with thousands separators
}

describe("NEYX Vesting Wallet Contract tests", function () {
  let token: any;
  let vestingWallet: any;
  let addr_3_3_0_ReserveFund: any;
  let beneficiary: any;
  let amount: any;
  const duration = 60 * 60 * 24 * 30; // 30 days in seconds
  let startOfVesting: number;

  before(async function () {
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
      Address15,
    ] = await ethers.getSigners();

    const initialOwner = deployer; // The address that will own the contract

    const addr_1_Community = Address01;
    const addr_2_Liquidity = Address02;
    const addr_3_1_ReserveFund = Address03;
    const addr_3_2_ReserveFund = Address04;
    addr_3_3_0_ReserveFund = Address05;
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
    token = await NEYX_Token_Factory.deploy(
      initialOwner,
      initialWallets,
      initialBalances
    );

    // NEYX Vesting -----------
    // Set benefeficiary
    beneficiary = Address15;

    // Amount to Transfer all tokens from addr_3_3_0_ReserveFund to NEYXVestingWallet
    amount = await token.balanceOf(addr_3_3_0_ReserveFund.address);

    // Set start of Vesting to now + 5 days
    const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
    startOfVesting = now + 5 * 24 * 60 * 60; // Start in 5 days
  });

  it("Should deploy the vesting wallet", async function () {
    const VestingWallet = await ethers.getContractFactory("NEYXVestingWallet");
    vestingWallet = await VestingWallet.deploy(
      beneficiary.address, // Beneficiary address
      startOfVesting, // Vesting start time
      duration // Vesting duration
    );
    await vestingWallet.waitForDeployment();

    expect(await vestingWallet.getAddress()).to.be.a("string");
  });

  it("Should transfer all tokens from Genesis pocket to the vesting wallet", async function () {
    // Check the initial balance of addr_3_3_0_ReserveFund
    const reserveFundBalance = await token.balanceOf(
      addr_3_3_0_ReserveFund.address
    );

    expect(reserveFundBalance).to.be.gt(
      0,
      "Reserve fund should have tokens initially"
    );

    // Transfer tokens from addr_3_3_0_ReserveFund to the vesting wallet
    await token
      .connect(addr_3_3_0_ReserveFund)
      .transfer(vestingWallet.getAddress(), reserveFundBalance);

    // Check the balance of the vesting wallet after the transfer
    const vestingWalletBalance = await token.balanceOf(
      vestingWallet.getAddress()
    );
    expect(vestingWalletBalance).to.equal(reserveFundBalance);

    // Verify that addr_3_3_0_ReserveFund has zero balance after the transfer
    const reserveFundRemainingBalance = await token.balanceOf(
      addr_3_3_0_ReserveFund.address
    );

    console.log("Genesis Pocket Balance before vesting:  ", formatBalance(reserveFundBalance));
    console.log("Vesting Wallet Balance  after vesting:  ", formatBalance(vestingWalletBalance));
    console.log("Genesis Pocket Balance  after vesting:  ",reserveFundRemainingBalance.toString());
    
    expect(reserveFundRemainingBalance).to.equal(0,"Reserve fund should have zero balance after transfer");
    
  });

  it("Should not release tokens when no tokens are releasable", async function () {
    // Capture initial state
    const releasableAmountBefore = await vestingWallet["releasable(address)"](
      token.getAddress()
    );
    console.log(`Tokens Available for release:            ${formatBalance(releasableAmountBefore)}`);
    expect(releasableAmountBefore).to.equal(0, "Releasable amount should be 0");

    const vestingWalletBalanceBefore = await token.balanceOf(
      vestingWallet.getAddress()
    );
    const beneficiaryBalanceBefore = await token.balanceOf(beneficiary.address);

    // Attempt to release tokens
    const tx = await vestingWallet["release(address)"](token.getAddress());

    // Capture logs to ensure no `ERC20Released` event with non-zero amount
    const receipt = await tx.wait();
    const releaseEvent = receipt.events?.find(
      (event) => event.event === "ERC20Released"
    );
    if (releaseEvent) {
      const releasedAmount = releaseEvent.args?.[1]; // Amount is the second argument
      console.log(`releasedAmount : ${formatBalance(releasedAmount)}`);
      expect(releasedAmount).to.equal(0, "No tokens should be released");
    }

    // Check balances remain unchanged
    const vestingWalletBalanceAfter = await token.balanceOf(
      vestingWallet.getAddress()
    );
    const beneficiaryBalanceAfter = await token.balanceOf(beneficiary.address);

    console.log(`Contract balance after vesting attempt:    ${formatBalance(vestingWalletBalanceAfter)}`);
    console.log(`Beneficiary balance after vesting attempt: ${formatBalance(beneficiaryBalanceAfter)}`);

    expect(vestingWalletBalanceAfter).to.equal(
      vestingWalletBalanceBefore,
      "Vesting wallet balance should not change"
    );
    expect(beneficiaryBalanceAfter).to.equal(
      beneficiaryBalanceBefore,
      "Beneficiary balance should not change"
    );
  });

  it("Should allow partial release after half the vesting period", async function () {
    // Fast-forward time to 15 days (half the duration)
    const targetDate = startOfVesting + 15 * 24 * 60 * 60; // Start + 15 days
    const targetDateReadable = new Date(targetDate * 1000).toISOString();

    const currentBlockBefore = await ethers.provider.getBlock("latest");
    const currentTimestampBefore = currentBlockBefore.timestamp;

    // Convert the timestamp to a readable date
    const startOfVestingReadable = new Date(
      startOfVesting * 1000
    ).toISOString();
    const currentDateBefore = new Date(
      currentTimestampBefore * 1000
    ).toISOString();
    console.log(`start of vesting date : ${startOfVestingReadable}`);
    console.log("Test date (50% of vesting schedule):", targetDateReadable);
    console.log(
      "Current blockchain date before fast forward:",
      currentDateBefore
    );

    await ethers.provider.send("evm_increaseTime", [
      5 * 24 * 60 * 60 + duration / 2,
    ]); // Half the vesting duration
    await ethers.provider.send("evm_mine", []);

    // Get the current block's timestamp
    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTimestamp = currentBlock.timestamp;

    // Convert the timestamp to a readable date
    const currentDate = new Date(currentTimestamp * 1000).toISOString();
    console.log("Blockchain date after fast forward:", currentDate);

    const releasable = await vestingWallet["releasable(address)"](
      token.getAddress()
    );
    console.log(`Tokens Available for release:                ${formatBalance(releasable)}`);

    // Release tokens
    await vestingWallet["release(address)"](token.getAddress());
    const released = await token.balanceOf(beneficiary.address);

    console.log(`Token Actually released:                     ${formatBalance(releasable)}`);

    const expectedReleased = amount / 2n; // 50% released
    // Compare with tolerance (1e18 for 1 token precision)
    const tolerance = BigInt(40e18); // Adjust tolerance as needed
    expect(released).to.be.closeTo(expectedReleased, tolerance);
  });

  it("Should release the remaining tokens after full vesting period", async function () {
    // Fast-forward time to the end of the vesting period
    await ethers.provider.send("evm_increaseTime", [duration / 2]); // Remaining half duration
    await ethers.provider.send("evm_mine", []);

    const currentBlock = await ethers.provider.getBlock("latest");
    const currentTimestamp = currentBlock.timestamp;

    // Convert the timestamp to a readable date
    const currentDate = new Date(currentTimestamp * 1000).toISOString();
    console.log("Chain date after fast forward to end of Vesting: ", currentDate);

    // Release tokens
    await vestingWallet["release(address)"](token.getAddress());
    const finalBalance = await token.balanceOf(beneficiary.address);

    console.log(`Final beneficiary balance:                 ${formatBalance(finalBalance)}`);
    console.log(`Initial Genesis pocket balance :           ${formatBalance(amount)}`);

    expect(finalBalance).to.equal(amount); // Full amount released
  });
});
