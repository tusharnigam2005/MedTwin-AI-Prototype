const hre = require("hardhat");

async function main() {

    console.log("Deploying MedTwinTrust...");

    const Factory = await hre.ethers.getContractFactory("MedTwinTrust");

    const contract = await Factory.deploy();

    await contract.waitForDeployment();

    console.log(
        "Contract deployed to:",
        await contract.getAddress()
    );

}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;

});