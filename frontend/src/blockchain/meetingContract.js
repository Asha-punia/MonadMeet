import { Contract } from "ethers";
import { connectWallet } from "./wallet";
export const MEETING_CONTRACT_ADDRESS = "0x7dFc511c776B5Be2B9c6e3014df9413A25d6c357";
const MEETING_CONTRACT_ABI = [
    "function createMeeting() public returns (uint256)",
    "function meetingCount() view returns (uint256)"
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