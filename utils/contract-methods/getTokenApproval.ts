import { TokenDetails } from "@/interfaces";
import { ethers } from "ethers";
const tokenAbi = require("../../abis/TokenA.sol/TokenA.json").abi;

const getTokenApproval = async (token : TokenDetails, addressToApprove : string, amountToApprove : string)=>{

    amountToApprove = ethers.utils.parseUnits(amountToApprove, token.address.decimals).toString();

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const tokenContract = new ethers.Contract(token.address.contract_address, tokenAbi, newSigner);
    const userAddress = await newSigner.getAddress();

    const approveTransaction = await tokenContract.approve(addressToApprove, amountToApprove);
    await approveTransaction.wait()

    const approvalAmount = await tokenContract.allowance(userAddress, addressToApprove);
    console.log("Amount Approved for Token : ", token.name);
    console.log(approvalAmount.toString());
}

export default getTokenApproval;
// module.exports = {getTokenApproval};