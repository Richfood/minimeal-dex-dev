import { ethers, BigNumber } from 'ethers';
import { Token, CurrencyAmount, TradeType, Percent, ChainId } from '@uniswap/sdk-core';
import { FeeAmount, Pool, Route, Trade } from '@uniswap/v3-sdk';

// Define the types for token, pool, and function parameters
interface TokenDetails {
    name : string;
    symbol : string;
    address : string;
    decimals : number;
}

interface PoolDetails {
    sqrtPriceX96: BigNumber | string;
    liquidity: BigNumber | string;
    tick: number;
    fee: number;
}

// Define the main function with type annotations
async function getAmountOutV3(
    // pool: PoolDetails, 
    amountIn: BigNumber | string, 
    tokenIn: TokenDetails, 
    tokenOut: TokenDetails, 
    sqrtPriceX96 : BigNumber | string,
    liquidity : BigNumber | string,
    fee : FeeAmount,
    tick : number,
    slippageTolerance: Percent, 
): Promise<string> {

    const chainId = ChainId.PULSE;

    // Create token objects for input and output tokens
    const tokenInObj = new Token(chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol);
    const tokenOutObj = new Token(chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol);

    // Define the input amount as a CurrencyAmount
    const amountInObj = CurrencyAmount.fromRawAmount(tokenInObj, amountIn.toString());

    // Create a pool object with the provided details
    const poolObj = new Pool(
        tokenInObj,
        tokenOutObj,
        fee,
        sqrtPriceX96.toString(),
        liquidity.toString(),
        tick
    );


    // Create a route and trade for the swap
    const route = new Route([poolObj], tokenInObj, tokenOutObj);
    const trade = Trade.createUncheckedTrade({
        route: route,
        inputAmount: amountInObj,
        outputAmount: CurrencyAmount.fromRawAmount(tokenOutObj, '0'), // Create a placeholder for output
        tradeType: TradeType.EXACT_INPUT,
    });

    // Return the expected amount out, formatted to 6 decimal places
    return trade.outputAmount.toFixed(6);
}

export { getAmountOutV3 };
