import { ethers } from "ethers";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage, expandIfNeeded } from "./generalFunctions";
import SmartRouterArtifact from "../abis/SmartRouter.sol/SmartRouter.json";
import addresses from "./address.json";

const SMART_ROUTER_ABI = SmartRouterArtifact.abi;

export async function swapExactTokensForTokens(
    token0: TokenDetails,
    token1: TokenDetails,
    amountIn: string,
    slippageTolerance: number,
    amountOut: string,
    data: any
) {

    if (!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress();

    amountIn = ethers.utils.parseUnits(expandIfNeeded(amountIn), token0.address.decimals).toString();

    const routePath = data.tokenPath

    // console.log(data);

    // Extract addresses from routePath if it exists
    const pathArray = routePath?.map((route: { address: any; })=> route.address);
    console.log("🚀 ~ pathArray:", pathArray);

    // Check if pathArray is null, undefined, or empty
    if (!pathArray || pathArray.length === 0) {
        console.log("🚀 ~ pathArray is empty or undefined.");
        return;
    }


    const SmartRouterAddress = addresses.PancakeRouterAddress;
    const SmartRouterContract = new ethers.Contract(SmartRouterAddress, SMART_ROUTER_ABI, newSigner);

    let recipient = newSignerAddress;

    amountOut = ethers.utils.parseUnits(amountOut, token1.address.decimals).toString();
    let amountOutMinimum = (Number(amountOut) - Math.round(adjustForSlippage(amountOut, slippageTolerance))).toString();

    console.log("🚀 ~ slippageTolerance:", slippageTolerance)
    console.log("🚀 ~ amountOutMinimum:", amountOutMinimum)
    console.log("🚀 ~ amountIn:", amountIn)
    console.log("🚀 ~ recipient:", recipient);

    const valueToSend = token0.symbol === "PLS" ? amountIn : 0;

    const SmartRouterContractExactTokensForTokensTx = await SmartRouterContract.swapExactTokensForTokens(
        amountIn,
        amountOutMinimum,
        pathArray,
        recipient,
        {
            value: valueToSend
        }
    );

    await SmartRouterContractExactTokensForTokensTx.wait();

    return SmartRouterContractExactTokensForTokensTx.hash;
}
