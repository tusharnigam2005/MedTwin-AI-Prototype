const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedTwinTrust", function () {

    let contract;
    let owner;

    beforeEach(async function () {

        [owner] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("MedTwinTrust");

        contract = await Factory.deploy();

        await contract.waitForDeployment();

    });

    it("Should record a new document", async function () {

        const hash = ethers.keccak256(
            ethers.toUtf8Bytes("report1")
        );

        await contract.recordSignature(hash);

        expect(
            await contract.isRecorded(hash)
        ).to.equal(true);

    });

    it("Should reject duplicate documents", async function () {

        const hash = ethers.keccak256(
            ethers.toUtf8Bytes("duplicate")
        );

        await contract.recordSignature(hash);

        await expect(

            contract.recordSignature(hash)

        ).to.be.revertedWith(

            "Document already recorded"

        );

    });

    it("Should return false for unknown hash", async function () {

        const hash = ethers.keccak256(
            ethers.toUtf8Bytes("unknown")
        );

        expect(
            await contract.isRecorded(hash)
        ).to.equal(false);

    });

    it("Should verify stored document", async function () {

        const hash = ethers.keccak256(
            ethers.toUtf8Bytes("report2")
        );

        await contract.recordSignature(hash);

        const result = await contract.verify(hash);

        expect(result.exists).to.equal(true);

        expect(result.doctor).to.equal(owner.address);

        expect(result.timestamp).to.be.gt(0);

    });

    it("Should emit SignatureRecorded event", async function () {

        const hash = ethers.keccak256(
            ethers.toUtf8Bytes("event")
        );

        await expect(
            contract.recordSignature(hash)
        ).to.emit(
            contract,
            "SignatureRecorded"
        );

    });

});