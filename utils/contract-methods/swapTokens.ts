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
    token: TokenDetails,
    data: any,
    amountIn: string,
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

    amountIn = ethers.utils.parseUnits(expandIfNeeded(amountIn), token.address.decimals).toString();

    const SmartRouterAddress = addresses.PancakeV2RouterAddress;
    const SmartRouterContract = new ethers.Contract(SmartRouterAddress, SMART_ROUTER_ABI, newSigner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const refundETH = new ethers.utils.Interface([
        "function refundETH() external"
    ]);
    const refundETHData = refundETH.encodeFunctionData("refundETH", []);

    // let path = {};
    let recipient = newSignerAddress;

    if (amountIn !== null && slippageTolerance !== null) {
        let amountOutMinimum = (
            Number(amountIn) - Math.round(adjustForSlippage(amountIn, slippageTolerance))
        ).toString();
        console.log("🚀 ~ slippageTolerance:", slippageTolerance)
        console.log("🚀 ~ amountOutMinimum:", amountOutMinimum)
        console.log("🚀 ~ amountIn:", amountIn)
        console.log("🚀 ~ recipient:", recipient)
        console.log("🚀 ~ path:", path)

        const exactInput = new ethers.utils.Interface(EXACT_INPUT_ABI);
        const exactInputData = exactInput.encodeFunctionData("exactInput", [[path, recipient, amountIn, amountOutMinimum]]);


        const combinedData = [exactInputData, refundETHData];

        const SmartRouterContractExactInputMulticallTx = await SmartRouterContract["multicall(uint256,bytes[])"](deadline, combinedData, { value: ethers.utils.parseEther("1") });

        console.log("Running swap... Tx Details : ", SmartRouterContractExactInputMulticallTx);
        await SmartRouterContractExactInputMulticallTx.wait();
    } else {
        console.warn("amountIn or slippageTolerance is null");
        // Handle the case where amountIn or slippageTolerance is null
        return;
    }


}
