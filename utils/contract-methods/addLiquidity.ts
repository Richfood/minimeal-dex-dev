import { ethers } from "ethers";
import emulate from "../emulate-addLiquidity";
import { FeeAmount } from "@uniswap/v3-sdk";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage, decimalRound, expandIfNeeded, isNative } from "../generalFunctions";
import v2RouterArtifact from "../../abis/PancakeV2Router.sol/PancakeRouter.json";
import addresses from "../address.json";
import nfpmArtifact from "../../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import mintAbi from "../../abis/NonfungiblePositionManager.sol/MintAbi.json";

const nfpmAbi = nfpmArtifact.abi;
const V2_ROUTER_ABI = v2RouterArtifact.abi;

// function addLiquidityETH(
//     address token,
//     uint amountTokenDesired,
//     uint amountTokenMin,
//     uint amountETHMin,
//     address to,
//     uint deadline
export async function addLiquidityETH(
    token : TokenDetails,
    amountETHDesired : string,
    amountTokenDesired : string,
    deadline : string,
    slippageTolerance : number
) {

    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress()
    
    amountTokenDesired = ethers.utils.parseUnits(expandIfNeeded(amountTokenDesired), token.address.decimals).toString();

    let amountTokenMin = amountTokenDesired;
    let amountETHMin = ethers.utils.parseUnits(expandIfNeeded(amountETHDesired), "18").toString();
    amountTokenMin = adjustForSlippage(amountTokenMin, slippageTolerance).toString();
    amountETHMin = adjustForSlippage(amountETHMin, slippageTolerance).toString();

    const pancakeV2RouterAddress = addresses.PancakeV2RouterAddress;
    const pancakeV2RouterContract = new ethers.Contract(pancakeV2RouterAddress, V2_ROUTER_ABI, newSigner);

    const addLiquidityEthTx = await pancakeV2RouterContract.addLiquidityETH(
        token.address.contract_address,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        newSignerAddress,
        deadline,
        {
            value : ethers.utils.parseEther(amountETHDesired)
        }
    )

    await addLiquidityEthTx.wait();
    
    return addLiquidityEthTx.hash;
}

export async function addLiquidityV2(
    token0: TokenDetails,
    token1: TokenDetails,
    amount0Desired: string,
    amount1Desired: string,
    deadline : string,
    slippageTolerance : number
) {
    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress()

    amount0Desired = ethers.utils.parseUnits(expandIfNeeded(amount0Desired), token0.address.decimals).toString();
    // console.log("🚀 ~ amount0Desired:", amount0Desired)
    amount1Desired = ethers.utils.parseUnits(expandIfNeeded(amount1Desired), token1.address.decimals).toString();
    // console.log("🚀 ~ amount1Desired:", amount1Desired)
    let amount0Min = amount0Desired;
    // console.log("🚀 ~ amount0Min:", amount0Min)
    let amount1Min = amount1Desired;
    // console.log("🚀 ~ amount1Min:", amount1Min)

    amount0Min = expandIfNeeded(decimalRound((Number(amount0Min) - adjustForSlippage(amount0Min, slippageTolerance)).toString(), 0));
    // console.log("🚀 ~ amount0Min:", amount0Min)
    amount1Min = expandIfNeeded(decimalRound((Number(amount1Min) - adjustForSlippage(amount1Min, slippageTolerance)).toString(), 0));
    // console.log("🚀 ~ amount1Min:", amount1Min)

    const pancakeV2RouterAddress = addresses.PancakeV2RouterAddress;
    const pancakeV2RouterContract = new ethers.Contract(pancakeV2RouterAddress, V2_ROUTER_ABI, newSigner);

    const addLiquidityTx = await pancakeV2RouterContract.addLiquidity(token0.address.contract_address, token1.address.contract_address, amount0Desired, amount1Desired, amount0Min, amount1Min, newSignerAddress, deadline);
    await addLiquidityTx.wait();

    console.log("Liquidity added for Token A and Token B");

    return addLiquidityTx.hash;
}

export async function addLiquidityV3(
    contractAddress: string,
    token0: TokenDetails,
    token1: TokenDetails,
    tickLower: string,
    tickUpper: string,
    amount0Desired: string,
    amount1Desired: string,
    amount0Min: string,
    amount1Min: string,
    deadline: string,
    sqrtPriceX96: string,
    fee: FeeAmount,
    isFullRange : boolean
) {
    if(!window.ethereum) return;
    
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const nfpmContract = new ethers.Contract(contractAddress, nfpmAbi, newSigner);
    const recepientAddress = await newSigner.getAddress();

    if(isFullRange){
        amount0Min = "0";
        amount1Min = "0";
    }

    if(token0.address.contract_address.toLowerCase() > token1.address.contract_address.toLowerCase()){
        const temp = token0;
        token0 = token1;
        token1 = temp;
    }

    const is0Native = isNative(token0);
    const is1Native = isNative(token1);

    console.log("Is Native? = ",is0Native, is1Native);

    amount0Desired = ethers.utils.parseUnits(expandIfNeeded(amount0Desired), token0.address.decimals).toString();
    // console.log("🚀 ~ amount0Desired:", amount0Desired)
    amount1Desired = ethers.utils.parseUnits(expandIfNeeded(amount1Desired), token1.address.decimals).toString();
    // console.log("🚀 ~ amount1Desired:", amount1Desired)
    amount0Min = ethers.utils.parseUnits(expandIfNeeded(amount0Min), token0.address.decimals).toString();
    // console.log("🚀 ~ amount0Min:", amount0Min)
    amount1Min = ethers.utils.parseUnits(expandIfNeeded(amount1Min), token1.address.decimals).toString();
    // console.log("🚀 ~ amount1Min:", amount1Min)

    // console.log(`Amounts Desired and Minimum for Liquidity Provision:
    //     - Token 0 Desired: ${amount0Desired}
    //     - Token 1 Desired: ${amount1Desired}
    //     - Token 0 Minimum: ${amount0Min}
    //     - Token 1 Minimum: ${amount1Min}
    //   `);

    const createAndInitializePoolIfNecessary = new ethers.utils.Interface([
        "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) public returns (address)"
    ]);
    const createAndInitializePoolIfNecessaryData = createAndInitializePoolIfNecessary.encodeFunctionData("createAndInitializePoolIfNecessary", [token0.address.contract_address, token1.address.contract_address, fee, sqrtPriceX96]);

    const mint = new ethers.utils.Interface(mintAbi);
    const mintData = mint.encodeFunctionData("mint", [[token0.address.contract_address, token1.address.contract_address, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recepientAddress, deadline]]);
    
    console.log("Final Data - ");
    console.log("🚀 ~ deadline:", deadline)
    console.log("🚀 ~ recepientAddress:", recepientAddress)
    console.log("🚀 ~ amount1Min:", amount1Min)
    console.log("🚀 ~ amount0Min:", amount0Min)
    console.log("🚀 ~ amount1Desired:", amount1Desired)
    console.log("🚀 ~ amount0Desired:", amount0Desired)
    console.log("🚀 ~ tickUpper:", tickUpper)
    console.log("🚀 ~ tickLower:", tickLower)
    console.log("🚀 ~ fee:", fee)
    console.log("🚀 ~ token1:", token1)
    console.log("🚀 ~ token0:", token0)

    const refundETH = new ethers.utils.Interface([
        "function refundETH() external"
    ]);
    const refundETHData = refundETH.encodeFunctionData("refundETH", []);

    const combinedData = [createAndInitializePoolIfNecessaryData, mintData, refundETHData];

    const valueForNativeToken = is0Native ? amount0Desired : is1Native ? amount1Desired : 0;
    // const finalValueToPass = //ethers.utils.parseEther("1").add(valueForNativeToken);

    console.log("Running multicall for add liquidity");
    const tx = await nfpmContract.multicall(combinedData, {
        value: valueForNativeToken,
    });
    console.log("Multicall TX = ", tx);
    await tx.wait();
    console.log("Pool initialized and liquidity added. Transaction hash:", tx.hash);

    return tx.hash;
}

// export default addLiquidityV3;
// module.exports = {addLiquidity};