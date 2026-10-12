import { Contract } from "ethers";
import { connectWallet } from "./wallet";
export const MEETING_CONTRACT_ADDRESS = "0x7dFc511c776B5Be2B9c6e3014df9413A25d6c357";
const MEETING_CONTRACT_ABI = [
    "function createMeeting() public returns (uint256)",
    "function meetingCount() view returns (uint256)",
    "function meetingOwner(uint256) view returns (address)",
    "function meetingClosed(uint256) view returns (bool)",
    "function authorizedParticipant(uint256, address) view returns (bool)",
    "function attended(uint256, address) view returns (bool)",
    "function authorizeParticipant(uint256 meetingId, address participant)",
    "function recordAttendence(uint256 meetingId)",
];
export async function createBlockchainMeeting() {
    const { signer, provider, address } = await connectWallet();
    const contract = new Contract (
        MEETING_CONTRACT_ADDRESS,
        MEETING_CONTRACT_ABI,
        signer
    );
    const transaction = await contract.createMeeting();
    const receipt = await transaction.wait();
    if(!receipt || receipt.status !== 1) {
        throw new Error("Blockchain meeting creation failed!");
    }
    const meetingCount = await contract.meetingCount();
    return {
        meetingId: meetingCount.toString(),
        transactionHash: receipt.hash,
        walletAddress: address,
    }
}


export async function authorizeMeetingParticipant(meetingId, participantAddress) {
    const { signer, address } = await connectWallet();

    const contract = new Contract(
        MEETING_CONTRACT_ADDRESS,
        MEETING_CONTRACT_ABI,
        signer
    );

    // Confirm that the connected wallet owns this meeting.
    const owner = await contract.meetingOwner(meetingId);

    console.log("Meeting ID:", meetingId);
    console.log("Connected wallet:", address);
    console.log("On-chain meeting owner:", owner);

    if (owner.toLowerCase() !== address.toLowerCase()) {
        throw new Error(
            `Only the meeting owner can authorize participants. Owner: ${owner}`
        );
    }
    const transaction = await contract.authorizeParticipant(
        meetingId,
        participantAddress
    );

    const receipt = await transaction.wait();

    if (!receipt || receipt.status !== 1) {
        throw new Error("Participant authorization failed.");
    }

    return {
        transactionHash: receipt.hash,
        participantAddress
    };
}

export async function recordMeetingAttendance(meetingId) {
    const { signer, address } = await connectWallet();

    const contract = new Contract(
        MEETING_CONTRACT_ADDRESS,
        MEETING_CONTRACT_ABI,
        signer
    );

    const isAuthorized = await contract.authorizedParticipant(
        meetingId,
        address
    );

    if (!isAuthorized) {
        throw new Error("Your wallet is not authorized for this meeting.");
    }

    const isClosed = await contract.meetingClosed(meetingId);

    if (isClosed) {
        throw new Error("This meeting is already closed.");
    }

    const alreadyAttended = await contract.attended(meetingId, address);

    if (alreadyAttended) {
        return {
            alreadyRecorded: true,
            walletAddress: address
        };
    }

    const transaction = await contract.recordAttendence(meetingId);
    const receipt = await transaction.wait();

    if (!receipt || receipt.status !== 1) {
        throw new Error("Attendance recording failed.");
    }

    return {
        alreadyRecorded: false,
        transactionHash: receipt.hash,
        walletAddress: address
    };
}
export async function getMeetingOwner(meetingId) {
    const { provider } = await connectWallet();

    const contract = new Contract(
        MEETING_CONTRACT_ADDRESS,
        MEETING_CONTRACT_ABI,
        provider
    );

    return await contract.meetingOwner(meetingId);
}