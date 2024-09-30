import { ethers } from "ethers";
import emulate from "./emulate";
import { FeeAmount } from "@uniswap/v3-sdk";
const nfpmAbi = require("../abis/NonfungiblePositionManager.sol/NonfungiblePositionManager.json").abi;
const mintAbi = require("../abis/NonfungiblePositionManager.sol/MintAbi.json");

const addLiquidity = async (
    contractAddress : string, 
    token0Address : string, 
    token1Address : string,
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

    // function calculateFactor(num:any, decimals :any) : number{
    //     let size=decimals;
    //     while(num){
    //         num/=10;
    //         size++;
    //     }

    //     if(size<=0) size=decimals;

    //     return 10**(size-decimals);
    // }

    amount0Desired = roundToPrecision(amount0Desired,6).toString();
    amount1Desired = roundToPrecision(amount1Desired,6).toString();
    amount0Min = roundToPrecision((Number(amount0Min) - 0.1).toString() , 6).toString()//(roundToPrecision(amount0Min,6) - roundToPrecision("0.000001",6)).toString();
    amount1Min = roundToPrecision((Number(amount1Min) - 0.1).toString() , 6).toString()//(roundToPrecision(amount1Min,6) - roundToPrecision("0.000001",6)).toString();

    console.log("------------------");
    console.log(amount0Desired, amount1Desired, amount0Min, amount1Min);

    amount0Desired = ethers.utils.parseUnits(amount0Desired,6).toString();
    amount1Desired = ethers.utils.parseUnits(amount1Desired,6).toString();
    amount0Min = ethers.utils.parseUnits(amount0Min,6).toString();
    amount1Min = ethers.utils.parseUnits(amount1Min,6).toString();

    console.log(amount0Desired, amount1Desired, amount0Min, amount1Min);
    // const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    // const sqrtPriceX96 = "79228162514264337593543950336";

    const createAndInitializePoolIfNecessary = new ethers.utils.Interface([
        "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) public returns (address)"
    ]);
    const createAndInitializePoolIfNecessaryData = createAndInitializePoolIfNecessary.encodeFunctionData("createAndInitializePoolIfNecessary",[token0Address, token1Address, fee, sqrtPriceX96]);

    const mint = new ethers.utils.Interface(mintAbi);
    const mintData = mint.encodeFunctionData("mint",[[token0Address,token1Address,fee,tickLower,tickUpper,amount0Desired,amount1Desired,amount0Min,amount1Min,recepientAddress,deadline]]);

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