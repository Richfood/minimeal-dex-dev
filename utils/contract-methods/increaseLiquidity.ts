import { ethers } from "ethers";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage, expandIfNeeded, isNative } from "../generalFunctions";
import addresses from "../address.json";
import nfpmArtifact from "../../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";

const nfpmAbi = nfpmArtifact.abi;
/*
struct IncreaseLiquidityParams {
    uint256 tokenId;
    uint256 amount0Desired;
    uint256 amount1Desired;
    uint256 amount0Min;
    uint256 amount1Min;
    uint256 deadline;
}
*/
export async function increaseLiquidityV3(
    contractAddress : string,
    token0 : TokenDetails,
    token1 : TokenDetails,
    tokenId : BigInt,
    amount0Desired : string,
    amount1Desired : string,
    slippageTolerance : number,
    deadline : string,
) {
    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const nfpmContract = new ethers.Contract(contractAddress, nfpmAbi, newSigner);

    if(token0.address.contract_address > token1.address.contract_address){
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
    const amount0Min = ethers.utils.parseUnits(expandIfNeeded(adjustForSlippage(amount0Desired,slippageTolerance).toString()), token0.address.decimals).toString();
    // console.log("🚀 ~ amount0Min:", amount0Min)
    const amount1Min = ethers.utils.parseUnits(expandIfNeeded(adjustForSlippage(amount1Desired,slippageTolerance).toString()), token1.address.decimals).toString();
    // console.log("🚀 ~ amount1Min:", amount1Min)

    const increaseLiquidityData = {
        tokenId,
        amount0Desired,
        amount1Desired,
        amount0Min : "0",
        amount1Min : "0",
        deadline
    }

    const valueForNativeToken = is0Native ? amount0Desired : is1Native ? amount1Desired : 0;
    const finalValueToPass = ethers.utils.parseEther("1").add(valueForNativeToken);

    console.log("Running increase liquidty");
    const tx = await nfpmContract.increaseLiquidity(increaseLiquidityData, {
        value: finalValueToPass,
    });
    console.log("IncreaseLiquidity TX = ", tx);
    await tx.wait();
    console.log("Liquidity increased. Transaction hash:", tx.hash);

    return tx.hash;
}