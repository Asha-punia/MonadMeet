import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("MeetingManager", function () {
  it("Should create a meeting and set the caller as owner", async function () {
    const [owner, participant, otherUser] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    expect(await meetingManager.meetingCount()).to.equal(1);
    expect(await meetingManager.meetingOwner(1)).to.equal(owner.address);
  });
  it("Should allow the meeting owner to authorize a participant", async function () {
    const [owner, participant, otherUser] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.authorizeParticipant(1, participant.address);
    expect(await meetingManager.authorizedParticipant(1, participant.address)).to.equal(true);
  });
  it("Should prevent a non-owner from authorizing a participant", async function () {
    const [owner, participant, otherUser] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    try{
      await meetingManager.connect(otherUser).authorizeParticipant(1, participant.address);
      expect.fail("Non-owner was able to authorize participant");
    } catch (error) {
        expect(String(error)).to.include(
        "Only meeting owner can authorize"
      );
    }
  });
  it("Should allow an authorised participant to record attendence", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.authorizeParticipant(1, participant.address);
    await meetingManager.connect(participant).recordAttendence(1);
    expect(await meetingManager.attended(1, participant.address)).to.equal(true);
  });
  it("Should prevent an unauthorised participant to record attendence", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    try {
      await meetingManager.connect(participant).recordAttendence(1);
      expect.fail("Unauthorized participant was able to record attendance");
    }catch(error) {
      expect(String(error)).to.include("Only authorized participant can attend");
    }
  });
  it("Should allow the meeting owner to close a meeting", async function() {
    const [owner] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.closeMeeting(1);
    expect(await meetingManager.meetingClosed(1)).to.equal(true);
  });
  it("Should prevent the participant to record attendence when meeting is closed", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.authorizeParticipant(1, participant.address);
    await meetingManager.closeMeeting(1);
    try {
      await meetingManager.connect(participant).recordAttendence(1);
      expect.fail("Participant able to record attendence when meeting is closed");
    }catch(error) {
      expect(String(error)).to.include("Meeting is already closed");
    }
  });
  it("Should allow the meeting owner to create a decision", async function() {
    const [owner] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.createDecision(1, "Approve acquisition proposal");
    expect(await meetingManager.meetingDecision(1)).to.equal("Approve acquisition proposal");
  });
  it("Should allow a participant to approve a meeting decision", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.createDecision(1, "Approve acquisition proposal");
    await meetingManager.authorizeParticipant(1, participant.address);
    await meetingManager.connect(participant).recordApproval(1);
    expect(await meetingManager.decisionApproved(1, participant.address)).to.equal(true);
  });
  it("Should prevent an unauthorised participant to record approval", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.createDecision(1, "Approve acquisition proposal");
    try{
      await meetingManager.connect(participant).recordApproval(1);
      expect.fail("unauthorized participant able to approve meeting decision");
    }catch(error) {
      expect(String(error)).to.include("Only authorized participant can approve");
    }
  });
  it("Should prevent the participant to record aproval when meeting is closed", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.createDecision(1, "Approve acquisition proposal");
    await meetingManager.authorizeParticipant(1, participant.address);
    await meetingManager.closeMeeting(1);
    try{
      await meetingManager.connect(participant).recordApproval(1);
      expect.fail("participant able to approve meeting decision after a meeting is closed");
    }catch(error) {
      expect(String(error)).to.include("Meeting is already closed");
    }
  });
  it("Should allow the meeting owner to store proof after closing", async function () {
    const [owner] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();

    await meetingManager.createMeeting();
    await meetingManager.closeMeeting(1);

    const proof = ethers.keccak256(
      ethers.toUtf8Bytes("Final meeting record")
    );

    await meetingManager.storeMeetingProof(1, proof);

    expect(await meetingManager.meetingProof(1)).to.equal(proof);
  });
  it("Should prevent a non-owner from storing meeting proof", async function () {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();

    await meetingManager.createMeeting();
    await meetingManager.closeMeeting(1);

    const proof = ethers.keccak256(
      ethers.toUtf8Bytes("Final meeting record")
    );

    try {
      await meetingManager
        .connect(participant)
        .storeMeetingProof(1, proof);

      expect.fail("Non-owner was able to store meeting proof");
    } catch (error) {
      expect(String(error)).to.include(
        "Only meeting owner can store proof"
      );
    }
  });
  it("Should prevent storing meeting proof before the meeting is closed", async function () {
    const [owner] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();

    await meetingManager.createMeeting();

    const proof = ethers.keccak256(
      ethers.toUtf8Bytes("Final meeting record")
    );

    try {
      await meetingManager.storeMeetingProof(1, proof);

      expect.fail("Proof was stored before the meeting was closed");
    } catch (error) {
      expect(String(error)).to.include(
        "Meeting must be closed first"
      );
    }
  });
  it("Should prevent overwriting an existing meeting proof", async function () {
    const [owner] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();

    await meetingManager.createMeeting();
    await meetingManager.closeMeeting(1);

    const firstProof = ethers.keccak256(
      ethers.toUtf8Bytes("Final meeting record")
    );

    const secondProof = ethers.keccak256(
      ethers.toUtf8Bytes("Changed meeting record")
    );

    await meetingManager.storeMeetingProof(1, firstProof);

    try {
      await meetingManager.storeMeetingProof(1, secondProof);

      expect.fail("Existing meeting proof was overwritten");
    } catch (error) {
      expect(String(error)).to.include(
        "Meeting proof already stored"
      );
    }

    expect(await meetingManager.meetingProof(1)).to.equal(firstProof);
  });
  it("Should prevent authorizing participants for a nonexistent meeting", async function () {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();

    try {
      await meetingManager.authorizeParticipant(99, participant.address);
      expect.fail("Expected nonexistent meeting authorization to revert");
    } catch (error) {
      expect(String(error)).to.include("Meeting does not exist");
    }
  });
  it("Should prevent the owner to authorize a participant after closing a meeting", async function() {
    const [owner, participant] = await ethers.getSigners();
    const MeetingManager = await ethers.getContractFactory("MeetingManager");
    const meetingManager = await MeetingManager.deploy();
    await meetingManager.createMeeting();
    await meetingManager.closeMeeting(1);
    try{
      await meetingManager.authorizeParticipant(1, participant.address);
      expect.fail("Owner able to authorize participant after closing a meeting");
    }catch(error) {
      expect(String(error)).to.include("Meeting is already closed");
    }
  });
});
