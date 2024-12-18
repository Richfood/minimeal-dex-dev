import { Protocol, TokenDetails } from "@/interfaces";
import { TradeType, CurrencyAmount, Currency, Token, Price, ChainId, Percent } from "@uniswap/sdk-core";
import { Route } from "@uniswap/v3-sdk";
import axios from "axios";
import { AnyTxtRecord } from "dns";
import { BigNumber, ethers, FixedNumber } from "ethers";
import JSBI from 'jsbi';
import { decimalRound } from "../generalFunctions";

function calculateRawQuote(rawQuote : BigNumber, decimals : number){
    return (Number(BigNumber.from(rawQuote)) / Math.pow(10,decimals)).toString()
}

export async function getSmartOrderRoute(
    inputToken: TokenDetails,
    outputToken: TokenDetails,
    amountToTrade: string,
    protocol: Protocol[],
    tradeType: TradeType
) {

    // console.log(inputToken);
    // console.log(outputToken);

    const url = process.env.NEXT_PUBLIC_SMART_ORDER_ROUTER_API;
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const recipient = await newSigner.getAddress();

    console.log(inputToken, outputToken, amountToTrade, protocol, tradeType, recipient);

    const config_headers = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = {
        inputToken,
        outputToken,
        amountToTrade,
        protocol,
        tradeType,
        recipient,
    };

    try {
        console.log("URL = ",url);

        const response = await axios.get(url || "", {
            params: body,
        });

        console.log(response.data.finalRoute);

        const { rawQuote } = response.data.finalRoute;
        const decimals = outputToken.address.decimals;
        const value = decimalRound(calculateRawQuote(rawQuote, decimals),decimals/2);

        console.log(`Value: with trade type ${tradeType} `, value);

        // Return both response data and value
        return { data: response.data, value };
    } catch (error) {
        console.error("No Data", error);
        throw error; // Optionally rethrow the error if needed
    }
}

