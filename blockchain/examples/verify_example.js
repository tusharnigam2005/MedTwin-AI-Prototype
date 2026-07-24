const { ethers } = require("ethers");

require("dotenv").config();

const abi = require("../abi/MedTwinTrust.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);

const contract = new ethers.Contract(
    "YOUR_CONTRACT_ADDRESS",
    abi,
    provider
);

async function main(){

    const hash =
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

    const result =
    await contract.verify(hash);

    console.log(result);
}

main();