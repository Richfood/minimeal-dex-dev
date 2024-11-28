import axios from "axios";

export async function getTokenData(tokenAddress : string){
    const RPC_URL = process.env.NEXT_PUBLIC_TOKEN_DATA_RPC + tokenAddress;

    const tokenDataResponse = await axios.get(RPC_URL);
    console.log("🚀 ~ getTokenData ~ tokenData:", tokenDataResponse.data);

    const tokenData = tokenDataResponse.data;

    return tokenData;
}