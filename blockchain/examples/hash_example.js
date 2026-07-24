const fs = require("fs");
const { ethers } = require("ethers");

const pdf = fs.readFileSync("sample.pdf");

const hash = ethers.keccak256(pdf);

console.log(hash);