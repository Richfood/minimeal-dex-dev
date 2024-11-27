import { FeeAmount, nearestUsableTick, Pool, Position, TICK_SPACINGS, TickMath, priceToClosestTick } from "@uniswap/v3-sdk";
import { Percent, Price, Token } from "@uniswap/sdk-core";
import { BigNumber } from "ethers";

import addresses from "./address.json";
import { 
    priceToTick, 
    priceToSqrtPrice, 
    liquidity0, 
    calculateAmount1WhenLiquidity0Given, 
    liquidity1, 
    calculateAmount0WhenLiquidity1Given, 
    sqrtPriceToTick 
} from "./utils";
import { ethers } from "ethers";
import { TokenDetails } from "@/interfaces";
import { adjustForSlippage, decimalRound, expandIfNeeded, roundToPrecision } from "./generalFunctions";
import JSBI from "jsbi";
 
function emulateDecreaseLiquidity(
    tickLower: number, 
    tickUpper: number, 
    tickCurrent: number, 
    fee: FeeAmount, 
    token0Details: TokenDetails,
    token1Details: TokenDetails,
    slippageTolerance : number,
    totalLiquidity : string,
    percentLiquidityToRemove : number
) {
    const token0Address = token0Details.address.contract_address;
    const token1Address = token1Details.address.contract_address;

    const token0 = new Token(31337, token0Address, token0Details.address.decimals);
    const token1 = new Token(31337, token1Address, token1Details.address.decimals);

    let amount0Min: string;
    let amount1Min: string;

    const currentSqrtPrice = TickMath.getSqrtRatioAtTick(tickCurrent).toString();

    const liquidityToBeRemoved = BigInt(totalLiquidity) * BigInt(percentLiquidityToRemove) / BigInt(100);
    // console.log("🚀 ~ percentLiquidityToRemove:", percentLiquidityToRemove)
    // const liquidityToBeRemoved = BigInt(totalLiquidity)- BigInt(adjustForSlippage(totalLiquidity, percentLiquidityToRemove));


    try {
        // Create Pool instance
        const pool = new Pool(
            token0,
            token1,
            fee,
            currentSqrtPrice.toString(),
            liquidityToBeRemoved.toString(),
            tickCurrent
        );

        // Create Position instance
        const position = new Position({
            pool,
            liquidity: liquidityToBeRemoved.toString(),
            tickLower: tickLower,
            tickUpper: tickUpper
        });

        // Calculate mint amounts
        const slippageTolerancePercent = new Percent(slippageTolerance, 100);

        // Extract the amounts from the returned Readonly object
const { amount0, amount1 }: Readonly<{ amount0: JSBI; amount1: JSBI }> = position.burnAmountsWithSlippage(slippageTolerancePercent);


        let amount0DesiredFromPosition = JSBI.toNumber(amount0);
        let amount1DesiredFromPosition = JSBI.toNumber(amount1);

        //console.log(amount0DesiredFromPosition.toString(), amount1DesiredFromPosition.toString());

        // Set the minimum amounts
        amount0Min = parseFloat(amount0DesiredFromPosition.toString()).toString();
        amount1Min = parseFloat(amount1DesiredFromPosition.toString()).toString();

        //console.log(amount0DesiredFromPosition.toString(), amount1DesiredFromPosition.toString());
        amount0Min = roundToPrecision((Number(amount0Min)).toFixed(0) , token0.decimals).toString()//(roundToPrecision(amount0Min,6) - roundToPrecision("0.000001",6)).toString(); // Math.pow(10,-token0.decimals+4)
        console.log("🚀 ~ amount0Min:", amount0Min)
        amount1Min = roundToPrecision((Number(amount1Min)).toFixed(0) , token1.decimals).toString()//(roundToPrecision(amount1Min,6) - roundToPrecision("0.000001",6)).toString();
        console.log("🚀 ~ amount1Min:", amount1Min)

        // console.log("Formatted ", ethers.utils.formatUnits(amount0DesiredFromPosition, token0.decimals));

        // Return the final parameters
        return {//ethers.utils.parseUnits(amount1Desired?.toString() || "0", 6).toString(), //amount1Desired?.toString(),
            amount0Min: amount0Min?.toString(),
            amount1Min: amount1Min?.toString(),
            liquidityToRemove : liquidityToBeRemoved.toString()
        };
    } catch (error) {
        console.error(error);
        return;
    }
}

export default emulateDecreaseLiquidity;

/*
79244113692861321940131
79228162514264337593543950336
79216384492398872785077
79228162514264337593543950336
32376253762310902672622909795905527
1350174849792634181862360983626536

79196269788941351634505330538670869360004

79228162514264337593543950336
3881371428364983642911928221696
3881371428364983642911928221696


998976618347425408
5000000000000000000000
*/