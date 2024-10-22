import { ethers } from "ethers";
import { FeeAmount } from "@uniswap/v3-sdk";
import { TokenDetails } from '@/interfaces/index';
import { adjustForSlippage } from "./generalFunctions";
import SmartRouterArtifact from "../abis/SmartRouter.sol/SmartRouter.json";
import addresses from "./address.json";
import nfpmArtifact from "../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import mintAbi from "../abis/NonfungiblePositionManager.sol/MintAbi.json";

const nfpmAbi = nfpmArtifact.abi;
const SMART_ROUTER_ABI = SmartRouterArtifact.abi;

export async function Swapping(
    token: TokenDetails,
    amountETHDesired: string,
    amountTokenDesired: string
) {

    if (!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress()

    const slippageTolerance = 10;

    amountTokenDesired = ethers.utils.parseUnits(amountTokenDesired, token.address.decimals).toString();


    let amountTokenMin = amountTokenDesired;
    let amountETHMin = ethers.utils.parseUnits(amountETHDesired, "18").toString();
    amountTokenMin = adjustForSlippage(amountTokenMin, slippageTolerance).toString();
    amountETHMin = adjustForSlippage(amountETHMin, slippageTolerance).toString();

    const SmartRouterAddress = addresses.SmartRouterAddress;
    const SmartRouterContract = new ethers.Contract(SmartRouterAddress, SMART_ROUTER_ABI, newSigner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const SmartRouterContractExactInputTx = await SmartRouterContract.exactInput(
        token.address.contract_address,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        newSignerAddress,
        deadline,
        {
            value: ethers.utils.parseEther(amountETHDesired)
        }
    );

    console.log("Running swap... Tx Details : ", SmartRouterContractExactInputTx);
    await SmartRouterContractExactInputTx.wait();

    console.log("exactInput Swap Done. Running refund ETH");
    const SmartRouterContractRefundEthTx = await SmartRouterContract.refundETH()

    await SmartRouterContractRefundEthTx.wait();
    console.log("refund eth Done");
    // return SmartRouterContractTx.hash;
}
