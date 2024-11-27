import { ethers } from "ethers";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage } from "./generalFunctions";
import NFPM_ARTIFACT from "../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import addresses from "./address.json"

const NFPM_ABI = NFPM_ARTIFACT.abi;

export async function collectFees(
    amount0Max: string,
    amount1Max: string,
    tokenId: string
) {

    if (!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress();

    // Adjust for maximum slippage tolerance
    // let amountInMax = (Number(amountIn) + Math.round(adjustForSlippage(amountIn, slippageTolerance))).toString();
    // let amountOutMax = (Number(amountOut) + Math.round(adjustForSlippage(amountOut, slippageTolerance))).toString();

    const NFPM_ADDRESS = addresses.PancakePositionManagerAddress;
    const NFPManagerContract = new ethers.Contract(NFPM_ADDRESS, NFPM_ABI, newSigner);
    const params = {
        tokenId: tokenId,
        recipient: newSignerAddress,
        amount0Max,
        amount1Max
    }

    const NFPMContractCollectFeesTx = await NFPManagerContract.collect(params);
    await NFPMContractCollectFeesTx.wait();

    console.log("🚀Running swap ~ SmartRouterContractExactTokensForTokensTx:", NFPMContractCollectFeesTx.tx)
}
