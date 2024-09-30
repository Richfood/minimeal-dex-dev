import { FeeAmount, nearestUsableTick, Pool, Position, TICK_SPACINGS, TickMath } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
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

function emulate(
    priceLower: string, 
    priceUpper: string, 
    priceCurrent: string, 
    fee: FeeAmount, 
    amount0Entered = 0, 
    amount1Entered = 0
) {
    const tokenDAddress = addresses.TokenDAddress;
    const tokenBAddress = addresses.TokenBAddress;

    const tokenD = new Token(31337, tokenDAddress, 6);
    const tokenB = new Token(31337, tokenBAddress, 6);

    const tickSpacing = TICK_SPACINGS[fee];

    // Required constants
    const tickLower = nearestUsableTick(priceToTick(priceLower), tickSpacing);
    const tickUpper = nearestUsableTick(priceToTick(priceUpper), tickSpacing);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

    const currentTick = priceToTick(priceCurrent);
    const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(currentTick);

    let amount0Desired: number | undefined;
    let amount1Desired: number | undefined;
    let amount0Min: number | undefined;
    let amount1Min: number | undefined;

    // Price calculations
    const currentSqrtPrice = priceToSqrtPrice(priceCurrent).toString();
    const upperSqrtPrice = priceToSqrtPrice(priceUpper).toString();
    const lowerSqrtPrice = priceToSqrtPrice(priceLower).toString();
    let liquidity: string = "";

    // Calculate liquidity based on amount0Entered or amount1Entered
    if (amount0Entered) {
        amount0Desired = amount0Entered;

        const liquidityFor0 = Math.round(liquidity0(amount0Entered, currentSqrtPrice, upperSqrtPrice));
        amount1Desired = calculateAmount1WhenLiquidity0Given(liquidityFor0, currentSqrtPrice, lowerSqrtPrice);
        liquidity = liquidityFor0.toString();

    } else if (amount1Entered) {
        amount1Desired = amount1Entered;

        const liquidityFor1 = Math.round(liquidity1(amount1Entered, currentSqrtPrice, lowerSqrtPrice));
        amount0Desired = calculateAmount0WhenLiquidity1Given(liquidityFor1, currentSqrtPrice, upperSqrtPrice);
        liquidity = liquidityFor1.toString();
    }

    // console.log(amount0Desired, amount1Desired);

    // Convert sqrtPrice to tick
    // const currentTick = sqrtPriceToTick(currentSqrtPrice);

    try {
        // Create Pool instance
        const pool = new Pool(
            tokenD,
            tokenB,
            fee,
            sqrtPriceX96.toString(),
            liquidity,
            currentTick
        );

        // Create Position instance
        const position = new Position({
            pool,
            liquidity: pool.liquidity.toString(),
            tickLower: Number(tickLower),
            tickUpper: Number(tickUpper)
        });

        // Calculate mint amounts
        const { amount0: amount0DesiredFromPosition, amount1: amount1DesiredFromPosition } = position.mintAmounts;

        // console.log(amount0DesiredFromPosition.toString(), amount1DesiredFromPosition.toString());

        // Set the minimum amounts
        amount0Min = parseFloat(amount0DesiredFromPosition.toString());
        amount1Min = parseFloat(amount1DesiredFromPosition.toString());

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
            sqrtPriceX96: sqrtPriceX96.toString()
        };
    } catch (error) {
        console.error(error);
        return;
    }
}

export default emulate;