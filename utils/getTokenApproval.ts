import { ethers } from "ethers";
const tokenAbi = require("../abis/TokenA.sol/TokenA.json").abi;

const getTokenApproval = async (tokenAddress : string, addressToApprove : string, amountToApprove : string)=>{

    amountToApprove = ethers.utils.parseUnits(amountToApprove, 6).toString();

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, newSigner);
    const userAddress = await newSigner.getAddress();

    const approveTransaction = await tokenContract.approve(addressToApprove, amountToApprove);
    await approveTransaction.wait()

    const approvalAmount = await tokenContract.allowance(userAddress, addressToApprove);
    console.log("Amount Approved");
    console.log(approvalAmount.toString());
}

export default getTokenApproval;
// module.exports = {getTokenApproval};