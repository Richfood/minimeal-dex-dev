import { ethers } from "ethers";
import v2RouterArtifact from "../abis/PancakeV2Router.sol/PancakeRouter.json";
import addresses from "./address.json";
import { expandIfNeeded } from "./generalFunctions";
import { TokenDetails } from "@/interfaces";

const V2_ROUTER_ABI = v2RouterArtifact.abi;

export async function calculateV2Amounts (
    token0 : TokenDetails,
    token1 : TokenDetails,
    token0Amount = 0, 
    token1Amount = 0, 
    reserve0 : number,
    reserve1 : number,
    isSorted : boolean
) {
    console.log("🚀 ~ calculateV2Amounts token0:", token0)
    console.log("🚀 ~ calculateV2Amounts token1:", token1)

    if(!window.ethereum) return;

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const newSignerAddress = await newSigner.getAddress();

    const pancakeV2RouterAddress = addresses.PancakeV2RouterAddress;
    const pancakeV2RouterContract = new ethers.Contract(pancakeV2RouterAddress, V2_ROUTER_ABI, newSigner);

    if(!isSorted){
        // [token0,token1] = [token1,token0];
        [reserve0, reserve1] = [reserve1, reserve0];
    //     [token0Amount, token1Amount] = [token1Amount, token0Amount];
    }

    let reserve0Parsed : string;
    let reserve1Parsed : string;

    reserve0Parsed = ethers.utils.parseUnits(reserve0.toString(), token0.address.decimals).toString();
    reserve1Parsed = ethers.utils.parseUnits(reserve1.toString(), token1.address.decimals).toString();

    let quote : string;
    if(token0Amount){
        const parsedToken0Amount = ethers.utils.parseUnits(expandIfNeeded(token0Amount.toString()), token0.address.decimals).toString();
        quote = await pancakeV2RouterContract.quote(parsedToken0Amount, reserve0Parsed, reserve1Parsed);
        quote = ethers.utils.formatUnits(quote, token1.address.decimals);
        console.log("🚀 ~ quote:", quote)
    }
    else {
        const parsedToken1Amount = ethers.utils.parseUnits(expandIfNeeded(token1Amount.toString()), token1.address.decimals).toString();
        quote = await pancakeV2RouterContract.quote(parsedToken1Amount, reserve1Parsed, reserve0Parsed);
        quote = ethers.utils.formatUnits(quote, token0.address.decimals);
        console.log("🚀 ~ quote:", quote)
    }

    return parseFloat(quote.toString());
}

