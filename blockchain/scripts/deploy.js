const hre = require("hardhat");

async function main() {
  console.log("Deploying MedTwinTrust contract to network:", hre.network.name);

  const MedTwinTrust = await hre.ethers.getContractFactory("MedTwinTrust");
  const contract = await MedTwinTrust.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`✅ MedTwinTrust deployed successfully at address: ${address}`);
  console.log("Ensure you set this address in your backend and frontend environment configurations!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
