import { Protocol, TokenDetails } from "@/interfaces";
import { TradeType } from "@uniswap/sdk-core";
import axios from "axios";
import { ethers } from "ethers";

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
        const quote = response.data.finalRoute.quote;
        const value = quote.numerator[0] / (quote.denominator[0] * quote.decimalScale[0])

        console.log(value);

        return value;
    }
    catch(error){
        console.log("No Data", error);
    }
}