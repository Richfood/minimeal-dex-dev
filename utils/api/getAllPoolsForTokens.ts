import { TokenDetails } from "@/interfaces";
import { FeeAmount } from "@uniswap/v3-sdk";
import axios from "axios";


export async function getAllPoolsForTokens(token0 : TokenDetails, token1 : TokenDetails): Promise<any> {

    if(!token0 || !token1) return;

    if(token0.address.contract_address > token1.address.contract_address){
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
                    token1: "${token1.address.contract_address.toLowerCase()}"
                }
            ) {
                id
                feeTier
                liquidity
                liquidityProviderCount
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
  
      const allPools = response.data.data.pools; // Get the first pool
      console.log(allPools);
  
      return allPools;
    } catch (error) {
      console.error("Error fetching pool data:", error);
      return null;
    }
}