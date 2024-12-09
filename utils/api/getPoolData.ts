import { TokenDetails } from "@/interfaces";
import { FeeAmount } from "@uniswap/v3-sdk";
import axios from "axios";

export async function getPoolData(token0 : TokenDetails, token1 : TokenDetails, fee : FeeAmount): Promise<any> {

    if(!token0 || !token1) return;

    if(token0.address.contract_address.toLowerCase() > token1.address.contract_address.toLowerCase()){
      const tempToken = token0;
      token0 = token1;
      token1 = tempToken;
    }

    const subgraphUrl = process.env.NEXT_PUBLIC_V3_SUBGRAPH_API;
    const query = `
      query {
        pools(
          where: {
            token0: "${token0.address.contract_address.toLowerCase()}", 
            token1: "${token1.address.contract_address.toLowerCase()}", 
            feeTier: "${fee}"
          }
        ) {
            id
            tick
            token0Price
            token1Price
            liquidity
            feeTier
            token0 {
              name
              decimals
            }
            token1 {
              name
              decimals
            }
            ticks {
              price0
              price1
            }
        }
      }
    `;
  
    try {
      const response = await axios.post(
        subgraphUrl || "",
        {
          query, // Ensure it's correctly passed as a JSON object
        },
        {
          headers: {
            "Content-Type": "application/json",  // Ensure the Content-Type is correctly set
          }
        }
      );
  
      if (response.data.errors) {
        throw new Error(JSON.stringify(response.data.errors));
      }
  
      const poolData = response.data.data.pools[0]; // Get the first pool
      console.log(poolData);
  
      return poolData;
    } catch (error) {
      console.error("Error fetching pool data:", error);
      return null;
    }
}