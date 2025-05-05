import { ethers } from "hardhat";
import { Wallet } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";
import readline from "readline";

const networkName = hre.network.name;

const recipients: { address: string; amount: string }[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "POL_recipients.json"), "utf8")
);

// Helper to ask for confirmation
function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans.trim());
    }));
}

async function main() {
    const provider = ethers.provider;
    const privateKey = process.env.POCKET_PRIVATE_KEY_9;
    if (!privateKey) throw new Error("Missing POCKET_PRIVATE_KEY_9 in .env");

    const signer = new Wallet(privateKey, provider);

    console.log(`🔌 Connected to ${networkName}`);
    console.log(`🔑 Using signer: ${signer.address}`);

    const balance = await provider.getBalance(signer.address);
    console.log(`💰 Signer balance: ${ethers.formatEther(balance)} POL / MATIC`);

    let skipConfirmations = false;

    for (const { address, amount } of recipients) {
        const amountInWei = ethers.parseEther(amount);

        console.log(`\n➡️ Preparing to send ${amount} POL to ${address}`);

        if (!skipConfirmations) {
            const answer = (await askQuestion(`Confirm transfer? (y/n/all): `)).toLowerCase();

            if (answer === "n") {
                console.log(`❌ Skipped.`);
                continue;
            } else if (answer === "all") {
                skipConfirmations = true;
            } else if (answer !== "y") {
                console.log(`❓ Invalid response. Skipped.`);
                continue;
            }
        }

        try {
            const tx = await signer.sendTransaction({
                to: address,
                value: amountInWei
            });

            console.log(`🚀 Sent. Tx hash: ${tx.hash}`);
            await tx.wait();
            console.log(`✅ Confirmed.`);
        } catch (err) {
            console.error(`❌ Failed for ${address}:`, err);
        }
    }

    console.log("\n✅✅ All recipients processed.");
}

main().catch(console.error);