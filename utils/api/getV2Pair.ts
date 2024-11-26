import { TokenDetails } from "@/interfaces";
import { ethers } from "ethers";
import addresses from "../address.json";
import v2PairArtifact from "../../abis/PancakePair.sol/PancakePair.json";
import v2FactoryArtifact from "../../abis/PancakeFactory.sol/PancakeFactory.json";

export async function getV2Pair(token0: TokenDetails, token1: TokenDetails) {
    try {

        if(token0.address.contract_address.toLowerCase() > token1.address.contract_address.toLowerCase()){
            [token0,token1] = [token1,token0];
        }

        // Create a new provider and signer
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();

        const v2FactoryAddress = addresses.PancakeFactoryV2Address;
        const v2FactoryAbi = v2FactoryArtifact.abi;

        // Create a contract instance for the factory
        const v2FactoryContract = new ethers.Contract(v2FactoryAddress, v2FactoryAbi, newSigner);

        // Fetch the existing pool for the given tokens
        const existingPool = await v2FactoryContract.getPair(token0.address.contract_address, token1.address.contract_address);

        // Check if a pool exists
        if (existingPool === ethers.constants.AddressZero) {
            console.error("No pool found for the specified tokens.");
            return null; // Or handle this case as needed
        }

        const v2PairAddress = existingPool;
        const v2PairAbi = v2PairArtifact.abi;

        // Create a contract instance for the pair
        const v2PairContract = new ethers.Contract(v2PairAddress, v2PairAbi, newSigner);

        const factor0 = Math.pow(10, token0.address.decimals);
        const factor1 = Math.pow(10, token1.address.decimals);

        // Fetch reserves with error handling
        let reserves;
        try {
            reserves = await v2PairContract.getReserves();
        } catch (error) {
            console.error("Error fetching reserves:", error);
            return null; // Or handle this case as needed
        }

        const reserve0 = reserves._reserve0.toString() / factor0;
        const reserve1 = reserves._reserve1.toString() / factor1;

        console.log("Reserves:", reserve0, reserve1);
        console.log("Pair Address:", v2PairAddress);

        // Check for division by zero
        if (reserve1 === 0) {
            console.error("Reserve1 is zero, cannot calculate ratio.");
            return null; // Or handle this case as needed
        }

        return { reserve0, reserve1, v2PairAddress };

    } catch (error) {
        console.log("🚀 ~ getV2Pair ~ error:", error)
        return null; // Or handle this case as needed
    }
}
