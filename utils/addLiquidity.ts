import { ethers } from "ethers";
import emulate from "./emulate";
import { FeeAmount } from "@uniswap/v3-sdk";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage } from "./generalFunctions";
import v2RouterArtifact from "../abis/PancakeV2Router.sol/PancakeRouter.json";
import addresses from "./address.json";
import nfpmArtifact from "../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import mintAbi from "../abis/NonfungiblePositionManager.sol/MintAbi.json";

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
    amountTokenDesired : string
) {

    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress()

    const slippageTolerance = 10;
    
    amountTokenDesired = ethers.utils.parseUnits(amountTokenDesired, token.address.decimals).toString();

    let amountTokenMin = amountTokenDesired;
    let amountETHMin = ethers.utils.parseUnits(amountETHDesired, "18").toString();
    amountTokenMin = adjustForSlippage(amountTokenMin, slippageTolerance).toString();
    amountETHMin = adjustForSlippage(amountETHMin, slippageTolerance).toString();

    const pancakeV2RouterAddress = addresses.PancakeV2RouterAddress;
    const pancakeV2RouterContract = new ethers.Contract(pancakeV2RouterAddress, V2_ROUTER_ABI, newSigner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

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
) {
    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress()

    const slippageTolerance = 10;

    amount0Desired = ethers.utils.parseUnits(amount0Desired, token0.address.decimals).toString();
    amount1Desired = ethers.utils.parseUnits(amount1Desired, token1.address.decimals).toString();
    let amount0Min = ethers.utils.parseUnits(amount0Desired, token0.address.decimals).toString();
    let amount1Min = ethers.utils.parseUnits(amount1Desired, token1.address.decimals).toString();

    amount0Min = adjustForSlippage(amount0Min, slippageTolerance).toString();
    amount1Min = adjustForSlippage(amount1Min, slippageTolerance).toString();

    const pancakeV2RouterAddress = addresses.PancakeV2RouterAddress;
    const pancakeV2RouterContract = new ethers.Contract(pancakeV2RouterAddress, V2_ROUTER_ABI, newSigner);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

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

    console.log(`Amounts Desired and Minimum for Liquidity Provision:
        - Token 0 Desired: ${amount0Desired}
        - Token 1 Desired: ${amount1Desired}
        - Token 0 Minimum: ${amount0Min}
        - Token 1 Minimum: ${amount1Min}
        - sqrtPriceX96: ${sqrtPriceX96}
      `);

    function roundToPrecision(value: string, decimals: number): number {
        const factor = Math.pow(10, decimals);
        const roundedValue = (Math.round(parseFloat(value) * factor) / factor).toFixed(decimals);
        return Number(roundedValue);
    }
    function adjustForSlippage(amount: string, slippageTolerance: number): number {
        // Convert slippage tolerance percentage into a decimal (e.g., 1% becomes 0.01)
        const slippageFactor = slippageTolerance / 100;

        // Adjust the amount by reducing it based on the slippage tolerance
        return Number(amount) * slippageFactor;
    }

    amount0Desired = ethers.utils.parseUnits(amount0Desired, token0.address.decimals).toString();
    amount1Desired = ethers.utils.parseUnits(amount1Desired, token1.address.decimals).toString();
    amount0Min = ethers.utils.parseUnits(amount0Min, token0.address.decimals).toString();
    amount1Min = ethers.utils.parseUnits(amount1Min, token1.address.decimals).toString();

    console.log(`Amounts Desired and Minimum for Liquidity Provision:
        - Token 0 Desired: ${amount0Desired}
        - Token 1 Desired: ${amount1Desired}
        - Token 0 Minimum: ${amount0Min}
        - Token 1 Minimum: ${amount1Min}
      `);

    const createAndInitializePoolIfNecessary = new ethers.utils.Interface([
        "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) public returns (address)"
    ]);
    const createAndInitializePoolIfNecessaryData = createAndInitializePoolIfNecessary.encodeFunctionData("createAndInitializePoolIfNecessary", [token0.address.contract_address, token1.address.contract_address, fee, sqrtPriceX96]);

    const mint = new ethers.utils.Interface(mintAbi);
    const mintData = mint.encodeFunctionData("mint", [[token0.address.contract_address, token1.address.contract_address, fee, tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min, recepientAddress, deadline]]);

    const refundETH = new ethers.utils.Interface([
        "function refundETH() external"
    ]);
    const refundETHData = refundETH.encodeFunctionData("refundETH", []);

    const combinedData = [createAndInitializePoolIfNecessaryData, mintData, refundETHData];

    console.log("Running multicall for add liquidity");
    const tx = await nfpmContract.multicall(combinedData, {
        value: ethers.utils.parseEther("1"),
    });
    console.log("Multicall TX = ", tx);
    await tx.wait();
    console.log("Pool initialized and liquidity added. Transaction hash:", tx.hash);

    return tx.hash;
}

// export default addLiquidityV3;
// module.exports = {addLiquidity};