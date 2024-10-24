import { TokenDetails } from "@/interfaces";
import { ethers } from "ethers";
import { expandIfNeeded } from "../generalFunctions";
const tokenAbi = require("../../abis/TokenA.sol/TokenA.json").abi;

const getUserBalance = async (token : TokenDetails)=>{
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const tokenContract = new ethers.Contract(token.address.contract_address, tokenAbi, newSigner);
    const userAddress = await newSigner.getAddress();

    const userBalance = (await tokenContract.balanceOf(userAddress)).toString();

    const userBalanceForToken = expandIfNeeded((userBalance / Math.pow(10, token.address.decimals)).toString());
    console.log("🚀 ~ getUserBalance ~ userBalanceForToken:", userBalanceForToken)

    return userBalanceForToken;
}

export default getUserBalance;