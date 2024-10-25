import { TokenDetails } from "@/interfaces";
import { ethers } from "ethers";
import { expandIfNeeded } from "../generalFunctions";
const tokenAbi = require("../../abis/TokenA.sol/TokenA.json").abi;

const getUserBalance = async (token: TokenDetails) => {
    try {
        // Ensure MetaMask is available
        if (!window.ethereum) {
            console.error("MetaMask is not installed.");
            return "MetaMask not available";
        }

        const newProvider = new ethers.providers.Web3Provider(window.ethereum);

        // Ensure wallet is connected
        const accounts = await newProvider.listAccounts();
        if (accounts.length === 0) {
            console.error("No connected accounts. Please connect MetaMask.");
            return "Wallet not connected";
        }

        const newSigner = newProvider.getSigner();
        const userAddress = await newSigner.getAddress(); // Address from the connected wallet

        // Create token contract instance
        const tokenContract = new ethers.Contract(
            token.address.contract_address,
            tokenAbi,
            newSigner
        );

        // Fetch balance and handle decimals properly
        const rawBalance = await tokenContract.balanceOf(userAddress);
        const userBalance = ethers.utils.formatUnits(rawBalance, token.address.decimals);

        const userBalanceForToken = expandIfNeeded(userBalance); // Format if needed
        console.log("🚀 ~ getUserBalance ~ userBalanceForToken:", userBalanceForToken);

        return userBalanceForToken;
    } catch (error) {
        console.error("Error in getUserBalance:", error);
        return "Error fetching balance";
    }
};

export default getUserBalance;
