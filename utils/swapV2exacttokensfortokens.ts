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
    routePath: TokenDetails[] | null
) {

    if (!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress();

    amountIn = ethers.utils.parseUnits(expandIfNeeded(amountIn), token0.address.decimals).toString();

    // Extract addresses from routePath if it exists
    const pathArray = routePath?.map(route => route.address);
    console.log("🚀 ~ pathArray:", pathArray);

    // Check if pathArray is null, undefined, or empty
    if (!pathArray || pathArray.length === 0) {
        console.log("🚀 ~ pathArray is empty or undefined.");
        return;
    }

    // Create an array of 'address' types based on the length of pathArray
    const dataTypeArray = Array(pathArray.length).fill('address');

    // Pack the data with ethers.utils.solidityPack
    const path = ethers.utils.solidityPack(dataTypeArray, pathArray);
    console.log("🚀 ~ path:", path);


    const SmartRouterAddress = addresses.PancakeV2RouterAddress;
    const SmartRouterContract = new ethers.Contract(SmartRouterAddress, SMART_ROUTER_ABI, newSigner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    let recipient = newSignerAddress;

    let amountOutMinimum = (Number(amountOut) - Math.round(adjustForSlippage(amountOut, slippageTolerance))).toString();

    console.log("🚀 ~ slippageTolerance:", slippageTolerance)
    console.log("🚀 ~ amountOutMinimum:", amountOutMinimum)
    console.log("🚀 ~ amountIn:", amountIn)
    console.log("🚀 ~ recipient:", recipient);

    const SmartRouterContractExactTokensForTokensTx = await SmartRouterContract["swapExactTokensForTokens(uint256,uint256,address[],address,uint256)"](
        amountIn,
        amountOutMinimum,
        path,
        recipient,
        deadline
    );

    await SmartRouterContractExactTokensForTokensTx.wait();

    console.log("🚀Running swap ~ SmartRouterContractExactTokensForTokensTx:", SmartRouterContractExactTokensForTokensTx)
}
