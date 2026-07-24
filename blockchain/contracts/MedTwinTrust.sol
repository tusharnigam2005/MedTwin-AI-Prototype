// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedTwinTrust {

    struct Signature {
        address doctor;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => Signature) private records;

    event SignatureRecorded(
        bytes32 indexed docHash,
        address indexed doctor,
        uint256 timestamp
    );

    function recordSignature(bytes32 docHash) public {

        require(
            !records[docHash].exists,
            "Document already recorded"
        );

        records[docHash] = Signature({
            doctor: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit SignatureRecorded(
            docHash,
            msg.sender,
            block.timestamp
        );
    }

    function verify(bytes32 docHash)
        public
        view
        returns (
            address doctor,
            uint256 timestamp,
            bool exists
        )
    {
        Signature memory record = records[docHash];

        return (
            record.doctor,
            record.timestamp,
            record.exists
        );
    }

    function isRecorded(bytes32 docHash)
        public
        view
        returns (bool)
    {
        return records[docHash].exists;
    }
}