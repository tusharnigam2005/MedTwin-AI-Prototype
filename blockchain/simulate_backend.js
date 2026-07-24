const fs = require("fs");
const { ethers } = require("ethers");
require("dotenv").config();

// Import ABI
const abi = require("./abi/MedTwin Trust.json").abi;

// Read the PDF
const pdf = fs.readFileSync("./sample.pdf");

// Generate hash
const hash = ethers.keccak256(pdf);

console.log("Generated Hash:");
console.log(hash);

// Provider
const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);

// Wallet
const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);

// Contract
const contract = new ethers.Contract(
    "0x578Bbef27E8aa5ec0E212116b1eCcED62398B5cC",
    abi,
    wallet
);

async function main() {

    console.log("\nRecording hash on blockchain...");

    const tx = await contract.recordSignature(hash);

    console.log("Transaction Hash:");
    console.log(tx.hash);

    await tx.wait();

    console.log("\nStored Successfully!");

    console.log("\nReading from blockchain...");

    const result = await contract.verify(hash);

    console.log(result);
}

main().catch(console.error);