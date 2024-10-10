import { FeeAmount, nearestUsableTick, Pool, Position, TICK_SPACINGS, TickMath, priceToClosestTick } from "@uniswap/v3-sdk";
import { Price, Token } from "@uniswap/sdk-core";
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
import { adjustForSlippage, roundToPrecision } from "./generalFunctions";
 
function emulate(
    priceLower: string, 
    priceUpper: string, 
    priceCurrent: string, 
    fee: FeeAmount, 
    amount0Entered = "0", 
    amount1Entered = "0",
    token0Details: TokenDetails,
    token1Details: TokenDetails
) {
    console.log('Inside emulate - -----------------------------------------------------------------')
    const token0Address = token0Details.address.contract_address;
    const token1Address = token1Details.address.contract_address;

    const token0 = new Token(31337, token0Address, token0Details.address.decimals);
    const token1 = new Token(31337, token1Address, token1Details.address.decimals);

    const tickSpacing = TICK_SPACINGS[fee];

    amount0Entered = ethers.utils.parseUnits(amount0Entered.toString(), token0.decimals).toString();
    amount1Entered = ethers.utils.parseUnits(amount1Entered.toString(), token1.decimals).toString();

    console.log(`
        Before - 
        Lower price : ${priceLower},
        Upper price : ${priceUpper},
        Curr  price : ${priceCurrent}
    `)

    const decimalDifference = token1.decimals - token0.decimals;

    // priceLower = ethers.utils.parseUnits(priceLowe)

    // Required constants
    const tickLower = nearestUsableTick(priceToTick(priceLower, decimalDifference), tickSpacing); //priceToClosestTick(newPriceLower)//
    const tickUpper = nearestUsableTick(priceToTick(priceUpper, decimalDifference), tickSpacing);
    const currentTick = nearestUsableTick(priceToTick(priceCurrent, decimalDifference), tickSpacing);
    // console.log("tick upper = ", tickUpper);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

    let amount0Desired: string | undefined;
    let amount1Desired: string | undefined;
    let amount0Min: string | undefined;
    let amount1Min: string | undefined;

    console.log(`
        After - 
        Lower Tick : ${tickLower},
        Upper tick : ${tickUpper},
        Curr  tick : ${currentTick}
    `)

    // Price calculations
    const currentSqrtPrice = TickMath.getSqrtRatioAtTick(currentTick).toString();
    const upperSqrtPrice = TickMath.getSqrtRatioAtTick(tickUpper).toString();
    const lowerSqrtPrice = TickMath.getSqrtRatioAtTick(tickLower).toString();
    let liquidity: string = "";

    // Calculate liquidity based on amount0Entered or amount1Entered
    if (amount0Entered !== "0") {
        console.log("amount 0 entered")
        const amount0DesiredForCalculation = amount0Entered//ethers.utils.parseUnits(amount0Entered.toString(), token0.decimals).toString();

        const liquidityFor0 = Math.round(liquidity0(amount0DesiredForCalculation, currentSqrtPrice, upperSqrtPrice));
        amount1Desired =  calculateAmount1WhenLiquidity0Given(liquidityFor0, currentSqrtPrice, lowerSqrtPrice).toString();
        liquidity = liquidityFor0.toString();

        amount0Desired = amount0Entered.toString();

        console.log(amount1Desired, amount0Desired);
        amount0Desired = ethers.utils.formatUnits(amount0Desired, token0.decimals);
        amount1Desired = ethers.utils.formatUnits(amount1Desired, token1.decimals);

    } else if (amount1Entered !== "0") {
        console.log("amount 1 entered")
        const amount1DesiredForCalculation = amount1Entered//ethers.utils.parseUnits(amount1Entered.toString(), token1.decimals).toString();

        const liquidityFor1 = Math.round(liquidity1(amount1DesiredForCalculation, currentSqrtPrice, lowerSqrtPrice));
        amount0Desired = calculateAmount0WhenLiquidity1Given(liquidityFor1, currentSqrtPrice, upperSqrtPrice).toString();
        liquidity = liquidityFor1.toString();

        amount1Desired = ethers.utils.formatUnits(amount1Entered.toString(),token1.decimals);
        amount0Desired = ethers.utils.formatUnits(amount0Desired.toString(),token0.decimals);
    }

    console.log("Inside Emulate - ");
    console.log("lower, current, upper ticks : ", tickLower, currentTick, tickUpper)
    console.log("Supposed to be     : ", TickMath.getSqrtRatioAtTick(currentTick).toString());
    console.log("current sqrt price : ", currentSqrtPrice);
    console.log("lower Sqrt price   : ", lowerSqrtPrice)
    console.log("upper Sqrt price   : ", upperSqrtPrice)
    console.log("liquidity : ", liquidity);
    console.log("--------------------------------------------------------------------------");

    try {
        // Create Pool instance
        const pool = new Pool(
            token0,
            token1,
            fee,
            currentSqrtPrice.toString(),
            liquidity,
            currentTick
        );

        // Create Position instance
        const position = new Position({
            pool,
            liquidity: pool.liquidity.toString(),
            tickLower: tickLower,
            tickUpper: tickUpper
        });

        // Calculate mint amounts
        const { amount0: amount0DesiredFromPosition, amount1: amount1DesiredFromPosition } = position.mintAmounts;

        console.log(amount0DesiredFromPosition.toString(), amount1DesiredFromPosition.toString());

        // Set the minimum amounts
        amount0Min = parseFloat(amount0DesiredFromPosition.toString()).toString();
        amount1Min = parseFloat(amount1DesiredFromPosition.toString()).toString();

        const slippageTolerance = 10;
        amount0Min = roundToPrecision((Number(amount0Min) - adjustForSlippage(amount0Min, slippageTolerance)).toString() , token0.decimals).toString()//(roundToPrecision(amount0Min,6) - roundToPrecision("0.000001",6)).toString(); // Math.pow(10,-token0.decimals+4)
        amount1Min = roundToPrecision((Number(amount1Min) - adjustForSlippage(amount1Min, slippageTolerance)).toString() , token1.decimals).toString()//(roundToPrecision(amount1Min,6) - roundToPrecision("0.000001",6)).toString();

        amount0Min = ethers.utils.formatUnits(amount0Min,token0.decimals);
        amount1Min = ethers.utils.formatUnits(amount1Min,token1.decimals);

        console.log(amount0Desired, amount1Desired);
        console.log(amount0Min, amount1Min);

        // Return the final parameters
        return {
            tickLower: tickLower.toString(),
            tickUpper: tickUpper.toString(),
            amount0Desired: amount0Desired?.toString(),//ethers.utils.formatUnits(amount0Desired?.toString() || "0", 6).toString(), //amount0Desired?.toString(),
            amount1Desired: amount1Desired?.toString(),//ethers.utils.parseUnits(amount1Desired?.toString() || "0", 6).toString(), //amount1Desired?.toString(),
            amount0Min: amount0Min?.toString(),//ethers.utils.parseUnits(amount0Min?.toString() || "0", 6).toString(),
            amount1Min: amount1Min?.toString(),//ethers.utils.parseUnits(amount1Min?.toString() || "0", 6).toString(),
            deadline: deadline.toString(),
            sqrtPriceX96: currentSqrtPrice.toString()
        };
    } catch (error) {
        console.error(error);
        return;
    }
}

export default emulate;

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