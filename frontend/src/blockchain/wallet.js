import { BrowserProvider } from "ethers";
export const MONAD_TESTNET_CHAIN_ID = 10143;

export async function connectWallet() {
    if(!window.ethereum) {
        throw new Error("MetaMask is not installed!");
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    if(!accounts.length) {
        throw new Error("No wallet address was selected!");
    }

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    console.log("Connected chain ID:", network.chainId.toString());
    if(Number(network.chainId) !== MONAD_TESTNET_CHAIN_ID) {
        throw new Error("Please switch MetaMast to Monad Testnet!");
    }

    return {
        address: accounts[0],
        provider,
        signer: await provider.getSigner(),
    };
}