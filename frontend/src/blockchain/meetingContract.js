import {
    Contract,
    JsonRpcProvider,
} from "ethers";

import { connectWallet } from "./wallet.js";

export const MEETING_CONTRACT_ADDRESS =
    "0x7dFc511c776B5Be2B9c6e3014df9413A25d6c357";

const MONAD_RPC_URL = "https://testnet-rpc.monad.xyz";

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

function getReadOnlyContract() {
    const provider = new JsonRpcProvider(MONAD_RPC_URL);

    return new Contract(
        MEETING_CONTRACT_ADDRESS,
        MEETING_CONTRACT_ABI,
        provider
    );
}

export async function getMeetingOwner(meetingId) {
    const contract = getReadOnlyContract();
    return await contract.meetingOwner(meetingId);
}

export async function createBlockchainMeeting() {
    try {
        console.log("Create meeting: requesting wallet...");

        const { signer, address } = await connectWallet();

        console.log("Create meeting: wallet connected:", address);

        const contract = new Contract(
            MEETING_CONTRACT_ADDRESS,
            MEETING_CONTRACT_ABI,
            signer
        );

        console.log("Create meeting: requesting transaction approval...");

        const transaction = await contract.createMeeting();

        console.log("Transaction submitted:", transaction.hash);

        const receipt = await transaction.wait();

        if (!receipt || receipt.status !== 1) {
            throw new Error("Blockchain meeting creation failed.");
        }

        console.log("Create meeting: transaction confirmed.");

        const meetingCount = await contract.meetingCount();

        return {
            meetingId: meetingCount.toString(),
            transactionHash: receipt.hash,
            walletAddress: address,
        };
    } catch (error) {
        console.error("Blockchain create meeting error:", error);
        throw error;
    }
}

export async function authorizeMeetingParticipant(
    meetingId,
    participantAddress
) {
    const { signer, address } = await connectWallet();

    const contract = new Contract(
        MEETING_CONTRACT_ADDRESS,
        MEETING_CONTRACT_ABI,
        signer
    );

    const owner = await contract.meetingOwner(meetingId);

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
        participantAddress,
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
            walletAddress: address,
        };
    }

    const transaction = await contract.recordAttendence(meetingId);
    const receipt = await transaction.wait();

    if (!receipt || receipt.status !== 1) {
        throw new Error("Attendance recording failed.");
    }

    // Verify attendance on-chain after confirmation.
    const recorded = await contract.attended(meetingId, address);

    if (!recorded) {
        throw new Error("Transaction confirmed, but attendance was not verified.");
    }

    return {
        alreadyRecorded: false,
        transactionHash: receipt.hash,
        walletAddress: address,
    };
}
