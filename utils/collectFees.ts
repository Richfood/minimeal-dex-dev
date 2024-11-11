import { ethers } from "ethers";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage } from "./generalFunctions";
import NFTPositionManager from "../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import addresses from "./address.json";

const NFT_Position_Manager_ABI = NFTPositionManager.abi;

export async function collectFees(
    amountIn: string,
    amountOut: string,
    slippageTolerance: number,
    // tokenId:string,
    routePath: TokenDetails[],
) {

    if (!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress();

    const path = routePath.map(route => route.address);
    // Adjust for maximum slippage tolerance
    let amountInMax = (Number(amountIn) + Math.round(adjustForSlippage(amountIn, slippageTolerance))).toString();
    let amountOutMax = (Number(amountOut) + Math.round(adjustForSlippage(amountOut, slippageTolerance))).toString();


    const NFTPositionManagerAddress = addresses.PancakePositionManagerAddress;
    const NFTPositionManagerContract = new ethers.Contract(NFTPositionManagerAddress, NFT_Position_Manager_ABI, newSigner);
    const tokenId = 1;
    const params = {
        tokenId: tokenId,
        recipient: newSignerAddress,
        amount0Max: amountInMax,
        amount1Max: amountOutMax

    }

    const NFTPositionManagerContractCollectFeesTx = await NFTPositionManagerContract.collect(params, {
        value: ethers.utils.parseEther("1")
    });
    await NFTPositionManagerContractCollectFeesTx.wait();

    console.log("🚀Running swap ~ SmartRouterContractExactTokensForTokensTx:", NFTPositionManagerContractCollectFeesTx.tx)
}
