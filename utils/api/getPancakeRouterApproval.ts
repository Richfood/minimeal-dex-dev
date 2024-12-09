import { ethers } from "ethers";
import pairArtifact from "@/abis/PancakePair.sol/PancakePair.json";

const PAIR_ABI = pairArtifact.abi;

export const getPancakeRouterApproval = async (
    pairAddress : string,
    routerAddress : string,
    liquidityToApprove : string
) => {

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const userAddress = await newSigner.getAddress();

    const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, newSigner);

    const approvalTx = await pairContract.approve(routerAddress, liquidityToApprove);
    await approvalTx.wait();

    console.log("Router Approved");
};