import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";

describe("ClaimableNFT", function () {
  let user: Signer;
  let treasury: Signer;
  let neyxt: any;
  let nft: any;

  beforeEach(async function () {
    [user, treasury] = await ethers.getSigners();

    const totalSupply = ethers.parseUnits("1000000000", 18); // 1 billion NEYXT

    // Deploy NEYXT token with full supply to the user
    const NEYXT = await ethers.getContractFactory("NEYX_Token");
    neyxt = await NEYXT.deploy(
      await user.getAddress(),                // initialOwner
      [await user.getAddress()],             // initialWallets
      [totalSupply]                          // initialBalances
    );
    await neyxt.waitForDeployment();

    // Deploy NFT contract with NEYXT address and payment of 1 token
    const NFT = await ethers.getContractFactory("ClaimableNFT");
    nft = await NFT.deploy(
        await neyxt.getAddress(),
        await treasury.getAddress(),
        ethers.parseUnits("1", 18),
        await user.getAddress() // initialOwner
      );
    await nft.waitForDeployment();
  });

  it("allows user to claim NFT using NEYXT and signature", async function () {
    const tokenURI = "ipfs://example_uri";
    const eventId = 20250401;
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const nonce = await nft.nonces(await user.getAddress());

    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "string", "uint256", "uint256", "uint256"],
      [await user.getAddress(), tokenURI, deadline, eventId, nonce]
    );

    const rawHash = ethers.solidityPackedKeccak256(
        ["address", "string", "uint256", "uint256", "uint256"],
        [await user.getAddress(), tokenURI, deadline, eventId, nonce]
      );
      
      // Sign raw hash (signMessage adds EIP-191 internally)
      const signature = await user.signMessage(ethers.getBytes(rawHash));

    // Approve NFT contract to spend NEYXT
    await neyxt.connect(user).approve(await nft.getAddress(), ethers.parseUnits("1", 18));

    // Claim NFT
    const tx = await nft.connect(user).claimNFTWithSig(
      await user.getAddress(),
      tokenURI,
      deadline,
      eventId,
      signature
    );
    await tx.wait();

    const ownerOfNFT = await nft.ownerOf(1);
    expect(ownerOfNFT).to.equal(await user.getAddress());
  });

  it("prevents same user from claiming twice for the same event", async function () {
    const [user, treasury] = await ethers.getSigners();

    const totalSupply = ethers.parseUnits("1000000000", 18);
    const NEYXT = await ethers.getContractFactory("NEYX_Token");
    const neyxt = await NEYXT.deploy(
      await user.getAddress(),
      [await user.getAddress()],
      [totalSupply]
    );
    await neyxt.waitForDeployment();

    const NFT = await ethers.getContractFactory("ClaimableNFT");
    const nft = await NFT.deploy(
      await neyxt.getAddress(),
      await treasury.getAddress(),
      ethers.parseUnits("1", 18),
      await user.getAddress()
    );
    await nft.waitForDeployment();

    const tokenURI = "ipfs://example_twice";
    const eventId = 20250402;
    const deadline = Math.floor(Date.now() / 1000) + 600;
    const nonce = await nft.nonces(await user.getAddress());

    const rawHash = ethers.solidityPackedKeccak256(
      ["address", "string", "uint256", "uint256", "uint256"],
      [await user.getAddress(), tokenURI, deadline, eventId, nonce]
    );
    const signature = await user.signMessage(ethers.getBytes(rawHash));

    await neyxt.connect(user).approve(await nft.getAddress(), ethers.parseUnits("1", 18));
    await nft.connect(user).claimNFTWithSig(
      await user.getAddress(),
      tokenURI,
      deadline,
      eventId,
      signature
    );

    const newNonce = await nft.nonces(await user.getAddress());
    const newRawHash = ethers.solidityPackedKeccak256(
      ["address", "string", "uint256", "uint256", "uint256"],
      [await user.getAddress(), tokenURI, deadline, eventId, newNonce]
    );
    const newSignature = await user.signMessage(ethers.getBytes(newRawHash));

    await neyxt.connect(user).approve(await nft.getAddress(), ethers.parseUnits("1", 18));
    await expect(nft.connect(user).claimNFTWithSig(
      await user.getAddress(),
      tokenURI,
      deadline,
      eventId,
      newSignature
    )).to.be.revertedWith("Already claimed for this event");
  });

  it("reverts if user tries to send POL (native token) instead of NEYXT", async function () {
    const [user, treasury] = await ethers.getSigners();
  
    const totalSupply = ethers.parseUnits("1000000000", 18);
    const NEYXT = await ethers.getContractFactory("NEYX_Token");
    const neyxt = await NEYXT.deploy(
      await user.getAddress(),
      [await user.getAddress()],
      [totalSupply]
    );
    await neyxt.waitForDeployment();
  
    const NFT = await ethers.getContractFactory("ClaimableNFT");
    const nft = await NFT.deploy(
      await neyxt.getAddress(),
      await treasury.getAddress(),
      ethers.parseUnits("1", 18),
      await user.getAddress()
    );
    await nft.waitForDeployment();
  
    await expect(
      user.sendTransaction({
        to: await nft.getAddress(),
        value: ethers.parseEther("1")
      })
    ).to.be.revertedWith("This contract does not accept POL");
  });
});