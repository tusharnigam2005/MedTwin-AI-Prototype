// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MedTwinTrust
 * @dev Black-box immutable audit trail and verification contract for MedTwin AI.
 * Only SHA-256 cryptographic hashes go on-chain (Slide 25 & 26).
 */
contract MedTwinTrust {
    address public admin;

    struct AuditRecord {
        string recordId;
        string sha256Hash;
        uint256 timestamp;
        address submitter;
        bool hasDoctorApproval;
        address doctorSigner;
        uint256 approvalTimestamp;
    }

    // Mapping from unique record ID (e.g., "report_101") to its on-chain audit record
    mapping(string => AuditRecord) private records;
    
    // Mapping for patient consent scopes: patientId => dataScope => allowed (Slide 26)
    mapping(string => mapping(string => bool)) private consents;

    // Events for transparency
    event HashStored(string indexed recordId, string sha256Hash, uint256 timestamp, address indexed submitter);
    event DoctorApproved(string indexed recordId, address indexed doctor, uint256 timestamp);
    event PatientConsentUpdated(string indexed patientId, string indexed dataScope, bool allowed, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: Admin only");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice storeHash() — Writes a new record's SHA-256 hash with a timestamp (Slide 26)
     */
    function storeHash(string memory recordId, string memory sha256Hash) external {
        require(bytes(records[recordId].recordId).length == 0, "Record ID already exists on-chain");
        require(bytes(sha256Hash).length > 0, "Empty hash not permitted");

        records[recordId] = AuditRecord({
            recordId: recordId,
            sha256Hash: sha256Hash,
            timestamp: block.timestamp,
            submitter: msg.sender,
            hasDoctorApproval: false,
            doctorSigner: address(0),
            approvalTimestamp: 0
        });

        emit HashStored(recordId, sha256Hash, block.timestamp, msg.sender);
    }

    /**
     * @notice verifyHash() — Confirms a given document matches its on-chain hash (Slide 26)
     */
    function verifyHash(string memory recordId, string memory sha256Hash) external view returns (bool isMatch, uint256 storedTimestamp) {
        AuditRecord memory rec = records[recordId];
        if (bytes(rec.recordId).length == 0) {
            return (false, 0);
        }
        bool matchFound = (keccak256(abi.encodePacked(rec.sha256Hash)) == keccak256(abi.encodePacked(sha256Hash)));
        return (matchFound, rec.timestamp);
    }

    /**
     * @notice doctorApproval() — Records a doctor's signature against a pending record (Slide 26)
     */
    function doctorApproval(string memory recordId) external {
        require(bytes(records[recordId].recordId).length != 0, "Record does not exist");
        require(!records[recordId].hasDoctorApproval, "Already approved by doctor");

        records[recordId].hasDoctorApproval = true;
        records[recordId].doctorSigner = msg.sender;
        records[recordId].approvalTimestamp = block.timestamp;

        emit DoctorApproved(recordId, msg.sender, block.timestamp);
    }

    /**
     * @notice patientConsent() — Stores patient consent flags for each data-sharing scope (Slide 26)
     */
    function patientConsent(string memory patientId, string memory dataScope, bool allowed) external {
        consents[patientId][dataScope] = allowed;
        emit PatientConsentUpdated(patientId, dataScope, allowed, block.timestamp);
    }

    /**
     * @notice checkConsent() — Checks if patient allowed a data scope
     */
    function checkConsent(string memory patientId, string memory dataScope) external view returns (bool) {
        return consents[patientId][dataScope];
    }

    /**
     * @notice retrieveAudit() — Returns the full immutable history for a given record ID (Slide 26)
     */
    function retrieveAudit(string memory recordId) external view returns (
        string memory storedHash,
        uint256 timestamp,
        address submitter,
        bool hasDoctorApproval,
        address doctorSigner,
        uint256 approvalTimestamp
    ) {
        AuditRecord memory rec = records[recordId];
        require(bytes(rec.recordId).length != 0, "Record not found");
        return (
            rec.sha256Hash,
            rec.timestamp,
            rec.submitter,
            rec.hasDoctorApproval,
            rec.doctorSigner,
            rec.approvalTimestamp
        );
    }
}
