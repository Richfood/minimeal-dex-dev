import { Protocol, TokenDetails } from "@/interfaces";
import { TradeType } from "@uniswap/sdk-core";
import axios from "axios";
import { ethers } from "ethers";
import JSBI from 'jsbi';

function arrayToJSBI(numbers: number[]): JSBI {
    let result = JSBI.BigInt(0);
    for (let i = numbers.length - 1; i >= 0; i--) {
        if(numbers[i]!=0)
            result = JSBI.add(JSBI.multiply(result, JSBI.BigInt(10)), JSBI.BigInt(numbers[i]));
    }
    return result;
  }

function convertUniswapV3Amount(numeratorArray: Array<number>, denominatorArray: Array<number>, decimalScale: Array<number>) {

    const numerator = arrayToJSBI(numeratorArray);
    const denominator = arrayToJSBI(denominatorArray);
    const decimals = arrayToJSBI(decimalScale);

    console.log("Converted string to big number");
  
    // Calculate the fraction using BigNumber division
    const fraction = JSBI.divide(numerator, denominator);

    console.log("division done");
  
    const result = JSBI.toNumber(fraction) / JSBI.toNumber(decimals);
  
    console.log("heloo = ", result);

    return result.toString();
}

export async function getSmartOrderRoute(
    inputToken : TokenDetails, 
    outputToken : TokenDetails,
    amountToTrade : string,
    protocol : [Protocol],
    tradeType : TradeType,
){
    const url = "http://localhost:3001/smart-order-router/getPath";

    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const recepient = await newSigner.getAddress();
            console.log(inputToken, outputToken, amountToTrade, protocol, tradeType, recepient);

    const config_headers = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = {
        inputToken,
        outputToken,
        amountToTrade,
        protocol : protocol,
        tradeType,
        recepient
    };

    try{
        const response = await axios.get(url,{
            params : body
        })

        console.log(response.data.finalRoute);
        const quoteAdjustedForGas = response.data.finalRoute.quoteAdjustedForGas;
        const quote = response.data.finalRoute.quote;
        const numerator = quote.numerator;
        const denominator = quote.denominator;
        const decimalScale = quote.decimalScale;
        const value = convertUniswapV3Amount(numerator, denominator, decimalScale);

        console.log(value);

        return value;
    }
    catch(error){
        console.log("No Data", error);
    }
}