import { ethers } from "ethers";
import pairArtifact from "@/abis/PancakePair.sol/PancakePair.json";

const PAIR_ABI = pairArtifact.abi;

export const getMaxRemovableTokensV2 = async (
    pairAddress : string,
) => {

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const userAddress = await newSigner.getAddress();

    const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, newProvider);

    const userBalance = await pairContract.balanceOf(userAddress);
    console.log("🚀 ~ userBalance:", userBalance)

    // Fetch total supply of LP tokens
    const totalSupply = await pairContract.totalSupply();
    console.log("🚀 ~ totalSupply:", totalSupply)

    // Fetch pool reserves
    const { _reserve0, _reserve1 } = await pairContract.getReserves();

    // Calculate user's share of the reserves
    const share = userBalance / totalSupply;
    const amount0 = share * _reserve0;
    const amount1 = share * _reserve1;

    return { amount0, amount1 };
};