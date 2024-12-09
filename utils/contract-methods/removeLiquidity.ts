import { ethers } from "ethers";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage, decimalRound, expandIfNeeded, isNative } from "../generalFunctions";
import addresses from "../address.json";
import nfpmArtifact from "../../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import v2RouterArtifact from "../../abis/PancakeV2Router.sol/PancakeRouter.json"

const nfpmAbi = nfpmArtifact.abi;
const v2RouterAbi = v2RouterArtifact.abi;
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
export async function removeLiquidityV3(
    contractAddress : string,
    token0 : TokenDetails,
    token1 : TokenDetails,
    tokenId : BigInt,
    amount0Min : string,
    amount1Min : string,
    deadline : string,
    liquidity : string
) {
    console.log("🚀 ~ liquidity:", liquidity)
    console.log("🚀 ~ deadline:", deadline)
    console.log("🚀 ~ amount1Min:", amount1Min)
    console.log("🚀 ~ amount0Min:", amount0Min)
    console.log("🚀 ~ tokenId:", tokenId)
    console.log("🚀 ~ token1:", token1)
    console.log("🚀 ~ token0:", token0)
    console.log("🚀 ~ contractAddress:", contractAddress)
    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const nfpmContract = new ethers.Contract(contractAddress, nfpmAbi, newSigner);

    const is0Native = isNative(token0);
    const is1Native = isNative(token1);

    console.log("Is Native? = ",is0Native, is1Native);

    const decreaseLiquidityData = {
        tokenId,
        liquidity,
        amount0Min,
        amount1Min,
        deadline
    }
    console.log("🚀 ~ decreaseLiquidityData.tokenId:", decreaseLiquidityData.tokenId)
    console.log("🚀 ~ decreaseLiquidityData.liquidity:", decreaseLiquidityData.liquidity)
    console.log("🚀 ~ decreaseLiquidityData.amount0Min:", decreaseLiquidityData.amount0Min)
    console.log("🚀 ~ decreaseLiquidityData.amount1Min:", decreaseLiquidityData.amount1Min)
    console.log("🚀 ~ decreaseLiquidityData.deadline:", decreaseLiquidityData.deadline)

    console.log("Running decrease liquidty");
    const tx = await nfpmContract.decreaseLiquidity(decreaseLiquidityData);
    console.log("DecreaseLiquidity TX = ", tx);
    await tx.wait();
    console.log("Liquidity decreaseed. Transaction hash:", tx.hash);

    return tx.hash;
}


/*
function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
*/
export async function removeLiquidityV2(
    token0: TokenDetails,
    token1: TokenDetails,
    v2RouterContractAddress : string,
    liquidity : string,
    amount0Min : string,
    amount1Min : string,
    deadline : string
){
    console.log("🚀 ~ liquidity:", liquidity)
    console.log("🚀 ~ amount0Min:", amount0Min)
    console.log("🚀 ~ amount1Min:", amount1Min)
    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const userAddress = await newSigner.getAddress();
    const v2RouterContract = new ethers.Contract(v2RouterContractAddress, v2RouterAbi, newSigner);

    const removeLiquidityTx = await v2RouterContract.removeLiquidity(
        token0.address.contract_address,
        token1.address.contract_address,
        liquidity,
        amount0Min,
        amount1Min,
        userAddress,
        deadline
    )
    console.log("🚀 ~ removeLiquidityTx:", removeLiquidityTx)
    await removeLiquidityTx.wait()
    

    return removeLiquidityTx.hash;
}

/*
function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
*/
export async function removeLiquidityETHV2(
    token: TokenDetails,
    v2RouterContractAddress : string,
    liquidity : string,
    amountTokenMin : string,
    amountETHMin : string,
    deadline : string
){
    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const v2RouterContract = new ethers.Contract(v2RouterContractAddress, v2RouterAbi, newSigner);

    const removeLiquidityETHTx = await v2RouterContract.removeLiquidityETH(
        token.address.contract_address,
        liquidity,
        amountTokenMin,
        amountETHMin,
        deadline
    )    
    console.log("🚀 ~ removeLiquidityETHTx:", removeLiquidityETHTx);
    const txHash = await removeLiquidityETHTx.wait();
    console.log("🚀 ~ txHash:", txHash)

    return txHash.hash;
}