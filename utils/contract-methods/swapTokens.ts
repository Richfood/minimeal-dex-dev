import { ethers } from "ethers";
import { FeeAmount } from "@uniswap/v3-sdk";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage, expandIfNeeded } from "../generalFunctions";
import SmartRouterArtifact from "../../abis/SmartRouter.sol/SmartRouter.json";
import addresses from "../address.json";
import EXACT_INPUT_ABI from "../../abis/SmartRouter.sol/exactInputAbi.json";

const SMART_ROUTER_ABI = SmartRouterArtifact.abi;

interface PoolData {
    token0: { address: any; };
    token1: { address: any; };
    fee: any;
};

export async function swapV3(
    token0: TokenDetails,
    token1: TokenDetails,
    data: any,
    amountIn: string,
    amountOut : string,
    slippageTolerance: number | null
) {

    if (!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress()


    const pools = data.route.pools
    const tokenPath = data.tokenPath;
    const pathArray: any[] = [];
    const dataTypeArray: string[] = [];
    let index = 0;

    // console.log(data);

    pools.forEach((pool: PoolData) => {
        const tokenIn = tokenPath[index].address;
        let token0 = pool.token0.address;
        let token1 = pool.token1.address;
        const fee = pool.fee;

        if (tokenIn == token1)
            [token0, token1] = [token1, token0];

        if (index == 0) {
            pathArray.push(token0, fee, token1);
            dataTypeArray.push('address', 'uint24', 'address');
        }
        else {
            pathArray.push(fee, token1);
            dataTypeArray.push('uint24', 'address');
        }
        index++;
    });

    console.log(pathArray);

    const path = ethers.utils.solidityPack(dataTypeArray, pathArray);
    console.log("🚀 ~ path:", path)
    console.log(path);

    amountIn = ethers.utils.parseUnits(expandIfNeeded(amountIn), token0.address.decimals).toString();
    // console.log("🚀 ~ amountIn:", amountIn)
    amountOut = ethers.utils.parseUnits(expandIfNeeded(amountOut), token1.address.decimals).toString();
    // console.log("🚀 ~ amountOut:", amountOut)

    const SmartRouterAddress = addresses.PancakeRouterAddress;
    const SmartRouterContract = new ethers.Contract(SmartRouterAddress, SMART_ROUTER_ABI, newSigner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const refundETH = new ethers.utils.Interface([
        "function refundETH() external"
    ]);
    const refundETHData = refundETH.encodeFunctionData("refundETH", []);

    // let path = {};
    let recipient = newSignerAddress;

    if (amountIn !== null && slippageTolerance !== null) {
        let amountOutMinimum = expandIfNeeded(Math.round((
            Number(amountOut) - Math.round(adjustForSlippage(amountOut, slippageTolerance))
        )).toString());
        console.log("🚀 ~ slippageTolerance:", slippageTolerance)
        console.log("🚀 ~ amountOutMinimum:", amountOutMinimum)
        console.log("🚀 ~ amountIn:", amountIn)
        console.log("🚀 ~ recipient:", recipient)
        console.log("🚀 ~ path:", path)

        const exactInput = new ethers.utils.Interface(EXACT_INPUT_ABI);
        const exactInputData = exactInput.encodeFunctionData("exactInput", [[path, recipient, amountIn, amountOutMinimum]]);


        const valueToSend = token0.symbol === "PLS" ? amountIn : 0;

        const combinedData = [exactInputData];
        if(valueToSend){
            combinedData.push(refundETHData);
        }

        const SmartRouterContractExactInputMulticallTx = await SmartRouterContract["multicall(uint256,bytes[])"](deadline, combinedData, { value: valueToSend });

        console.log("Running swap... Tx Details : ", SmartRouterContractExactInputMulticallTx);
        await SmartRouterContractExactInputMulticallTx.wait();
        return SmartRouterContractExactInputMulticallTx.hash
    } else {
        console.warn("amountIn or slippageTolerance is null");
        // Handle the case where amountIn or slippageTolerance is null
        return;
    }


}

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
