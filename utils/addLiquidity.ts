import { ethers } from "ethers";
import emulate from "./emulate";
import { FeeAmount } from "@uniswap/v3-sdk";
import { TokenDetails } from "@/interfaces";
const nfpmAbi = require("../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json").abi;
const mintAbi = require("../abis/NonfungiblePositionManager.sol/MintAbi.json");

const addLiquidity = async (
    contractAddress : string, 
    token0 : TokenDetails, 
    token1 : TokenDetails,
    tickLower : string,
    tickUpper : string,
    amount0Desired : string,
    amount1Desired : string,
    amount0Min : string,
    amount1Min : string,
    deadline : string,
    sqrtPriceX96 : string,
    fee : FeeAmount,
)=>{
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const nfpmContract = new ethers.Contract(contractAddress, nfpmAbi, newSigner);
    const recepientAddress = await newSigner.getAddress();

    console.log(`Amounts Desired and Minimum for Liquidity Provision:
        - Token 0 Desired: ${amount0Desired}
        - Token 1 Desired: ${amount1Desired}
        - Token 0 Minimum: ${amount0Min}
        - Token 1 Minimum: ${amount1Min}
        - sqrtPriceX96: ${sqrtPriceX96}
      `);

    // if(token0Address > token1Address)
    //         [token0Address, token1Address] = [token1Address, token0Address];

    // const {
    //     tickLower,
    //     tickUpper,
    //     amount0Desired,
    //     amount1Desired,
    //     amount0Min,
    //     amount1Min,
    //     deadline,
    //     sqrtPriceX96
    // } = emulate(priceLower, priceUpper, priceCurrent, fee, amount0Entered, amount1Entered);

    // const fee = 100;
    // const tickLower = -200;
    // const tickUpper = 200;

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

    // function calculateFactor(num:any, decimals :any) : number{
    //     let size=decimals;
    //     while(num){
    //         num/=10;
    //         size++;
    //     }

    //     if(size<=0) size=decimals;

    //     return 10**(size-decimals);
    // }

    const slippageTolerance = 10;
    // amount0Desired = roundToPrecision(amount0Desired,token0.decimals).toString();
    // amount1Desired = roundToPrecision(amount1Desired,token1.decimals).toString();
    // amount0Min = roundToPrecision((Number(amount0Min) - adjustForSlippage(amount0Min, slippageTolerance)).toString() , token0.decimals).toString()//(roundToPrecision(amount0Min,6) - roundToPrecision("0.000001",6)).toString(); // Math.pow(10,-token0.decimals+4)
    // amount1Min = roundToPrecision((Number(amount1Min) - adjustForSlippage(amount1Min, slippageTolerance)).toString() , token1.decimals).toString()//(roundToPrecision(amount1Min,6) - roundToPrecision("0.000001",6)).toString();

    // console.log("------------------");
    // console.log(amount0Desired, amount1Desired, amount0Min, amount1Min);

    amount0Desired = ethers.utils.parseUnits(amount0Desired,token0.address.decimals).toString();
    amount1Desired = ethers.utils.parseUnits(amount1Desired,token1.address.decimals).toString();
    amount0Min = ethers.utils.parseUnits(amount0Min,token0.address.decimals).toString();
    amount1Min = ethers.utils.parseUnits(amount1Min,token1.address.decimals).toString();

    console.log(`Amounts Desired and Minimum for Liquidity Provision:
        - Token 0 Desired: ${amount0Desired}
        - Token 1 Desired: ${amount1Desired}
        - Token 0 Minimum: ${amount0Min}
        - Token 1 Minimum: ${amount1Min}
      `);
      
    // const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    // const sqrtPriceX96 = "79228162514264337593543950336";

    const createAndInitializePoolIfNecessary = new ethers.utils.Interface([
        "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) public returns (address)"
    ]);
    const createAndInitializePoolIfNecessaryData = createAndInitializePoolIfNecessary.encodeFunctionData("createAndInitializePoolIfNecessary",[token0.address, token1.address, fee, sqrtPriceX96]);

    const mint = new ethers.utils.Interface(mintAbi);
    const mintData = mint.encodeFunctionData("mint",[[token0.address,token1.address,fee,tickLower,tickUpper,amount0Desired,amount1Desired,amount0Min,amount1Min,recepientAddress,deadline]]);

    const refundETH = new ethers.utils.Interface([
        "function refundETH() external"
    ]);
    const refundETHData = refundETH.encodeFunctionData("refundETH",[]);

    const combinedData = [createAndInitializePoolIfNecessaryData, mintData, refundETHData];
    
    console.log("Running multicall for add liquidity");
    const tx = await nfpmContract.multicall(combinedData,{
        value: ethers.utils.parseEther("1"),
    });
    console.log("Multicall TX = ", tx);
    await tx.wait();
    console.log("Pool initialized and liquidity added. Transaction hash:", tx.hash);

    return tx.hash;
}

export default addLiquidity;
// module.exports = {addLiquidity};