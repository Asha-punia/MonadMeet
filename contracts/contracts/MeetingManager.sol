// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract MeetingManager {
    uint256 public meetingCount;

    mapping(uint256 => address) public meetingOwner;
    mapping(uint256 => bool) public meetingClosed;
    mapping(uint256 => string) public meetingDecision;
    mapping(uint256 => bytes32) public meetingProof;
    mapping(uint256 => mapping(address => bool)) public authorizedParticipant;
    mapping(uint256 => mapping(address => bool)) public attended;
    mapping(uint256 => mapping(address => bool)) public decisionApproved;

    function meetingExists(uint256 meetingId) internal view returns(bool) {
        return meetingId > 0 && meetingId <= meetingCount;
    }
    function createMeeting() public returns(uint256) {
        meetingCount++;
        meetingOwner[meetingCount] = msg.sender;
        return meetingCount;
    }
    function authorizeParticipant(uint256 meetingId, address participant) public {
        require(
            meetingExists(meetingId),
            "Meeting does not exist"
        );
        require(
            !meetingClosed[meetingId],
            "Meeting is already closed"
        );
        require(
            meetingOwner[meetingId] == msg.sender,
            "Only meeting owner can authorize"
        );
        authorizedParticipant[meetingId][participant] = true;
    }
    function recordAttendence(uint256 meetingId) public {
        require(
            authorizedParticipant[meetingId][msg.sender],
            "Only authorized participant can attend"
        );
        require(
            !meetingClosed[meetingId], 
            "Meeting is already closed"
        );
        attended[meetingId][msg.sender] = true;
    }
    function closeMeeting(uint256 meetingId) public {
        require(
            meetingOwner[meetingId] == msg.sender,
            "Only meeting owner can close"
        );
        meetingClosed[meetingId] = true;
    }
    function createDecision(uint256 meetingId, string memory decision) public {
        require(
            meetingOwner[meetingId] == msg.sender,
            "Only meeting owner can create decision"
        );
        require(
            !meetingClosed[meetingId],
            "Meeting is already closed"
        );
        meetingDecision[meetingId] = decision;
    }
    function recordApproval(uint256 meetingId) public {
        require(
            authorizedParticipant[meetingId][msg.sender],
            "Only authorized participant can approve"
        );
        require(
            !meetingClosed[meetingId],
            "Meeting is already closed"
        );
        decisionApproved[meetingId][msg.sender] = true;
    }
    function storeMeetingProof(uint256 meetingId, bytes32 proof) public {
        require(
            meetingOwner[meetingId] == msg.sender,
            "Only meeting owner can store proof"
        );
        require(
            meetingClosed[meetingId],
            "Meeting must be closed first"
        );
        require(
            meetingProof[meetingId] == bytes32(0),
            "Meeting proof already stored"
        );
        meetingProof[meetingId] = proof;
    }
}