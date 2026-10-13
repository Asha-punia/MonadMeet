
import { BrowserProvider } from "ethers";

export const MONAD_TESTNET_CHAIN_ID = 10143;

export async function connectWallet() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed or unavailable.");
    }

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (!accounts || accounts.length === 0) {
            throw new Error("No wallet account was selected.");
        }

        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (Number(network.chainId) !== MONAD_TESTNET_CHAIN_ID) {
            throw new Error(
                "Please switch MetaMask to Monad Testnet (Chain ID 10143)."
            );
        }

        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        return { address, provider, signer };
    } catch (error) {
        console.error("Wallet connection failed:", error);
        throw error;
    }
}
