const { ethers } = require("ethers");

require("dotenv").config();

const abi = require("../abi/MedTwinTrust.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);

const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);

const contract = new ethers.Contract(
    "YOUR_CONTRACT_ADDRESS",
    abi,
    wallet
);

async function main(){

    const hash =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    const tx =
    await contract.recordSignature(hash);

    await tx.wait();

    console.log("Hash stored successfully");
}

main();