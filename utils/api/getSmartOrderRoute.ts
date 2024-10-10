import { Protocol, TokenDetails } from "@/interfaces";
import { TradeType } from "@uniswap/sdk-core";
import axios from "axios";
import { ethers } from "ethers";

function convertQuoteToReadable(numerator: number[], denominator: number[], decimalScale: number[]): number {
    // Combine the numerator values into a single large number
    let bigNumerator = numerator[1] * 1e9 + numerator[0];  // Assuming base 1e9 for large number

    // Convert the fraction
    let fractionValue = bigNumerator / denominator[0]; // Since denominator is [1], this won't change much

    // Adjust for the token's decimal scale
    let readableValue = fractionValue / decimalScale[0];

    return readableValue;
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
        const numerator = quoteAdjustedForGas.numerator;
        const denominator = quoteAdjustedForGas.denominator;
        const decimalScale = quoteAdjustedForGas.decimalScale
        const value = convertQuoteToReadable(numerator, denominator, decimalScale);

        console.log(value);

        return value;
    }
    catch(error){
        console.log("No Data", error);
    }
}