// import { ethers } from "ethers";
// import { TokenDetails } from "@/interfaces";
// import { adjustForSlippage, expandIfNeeded } from "./generalFunctions";
// import NFTPositionManager from "../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
// import addresses from "./address.json";

// const NFT_Position_Manager_ABI = NFTPositionManager.abi;

// export async function collectFees(
//     token0: TokenDetails,
//     token1: TokenDetails,
//     amountIn: string,
//     slippageTolerance: number,
//     amountOut: string,
//     routePath: TokenDetails[]
// ) {

//     if (!window.ethereum) return;

//     const newProvider = new ethers.providers.Web3Provider(window.ethereum);
//     const newSigner = newProvider.getSigner();
//     const newSignerAddress = await newSigner.getAddress();

//     amountIn = ethers.utils.parseUnits(expandIfNeeded(amountIn), token0.address.decimals).toString();

//     const path = routePath.map(route => route.address);
//     // Adjust for maximum slippage tolerance
//     let amountInMax = (Number(amountIn) + Math.round(adjustForSlippage(amountIn, slippageTolerance))).toString();
//     let amountOutMax = (Number(amountOut) + Math.round(adjustForSlippage(amountOut, slippageTolerance))).toString();


//     const NFTPositionManagerAddress = addresses.PancakePositionManagerAddress;
//     const NFTPositionManagerContract = new ethers.Contract(NFTPositionManagerAddress, NFT_Position_Manager_ABI, newSigner);

//     const params = { []}

//     const NFTPositionManagerContractCollectFeesTx = await NFTPositionManagerContract.collect(params, {
//         value: ethers.utils.parseEther("1")
//     });
//     await NFTPositionManagerContractCollectFeesTx.wait();

//     console.log("🚀Running swap ~ SmartRouterContractExactTokensForTokensTx:", NFTPositionManagerContractCollectFeesTx.tx)
// }
