import { TokenDetails } from "@/interfaces";
import { FeeAmount } from "@uniswap/v3-sdk";
import {ethers} from "ethers";
import axios from "axios";

export async function getV3PositionsData(): Promise<any> {
  try {
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const userAddress = await newSigner.getAddress();

      const subgraphUrl = process.env.NEXT_PUBLIC_V3_SUBGRAPH_API;
      console.log("🚀 ~ getV3PositionsData ~ subgraphUrl:", subgraphUrl)
      const query = `
        query {
          positions(
            first: 20
            orderBy: pool__createdAtTimestamp
            orderDirection: desc
            where: {owner: "${userAddress.toLowerCase()}"}
          ) {
              id
              liquidity
              feeGrowthInside0LastX128
              feeGrowthInside1LastX128
              collectedFeesToken0
              collectedFeesToken1
              depositedToken0
              depositedToken1
              withdrawnToken0
              withdrawnToken1
              pool {
                feeGrowthGlobal0X128
                feeGrowthGlobal1X128
                tick
                feeTier
              }
              tickLower {
                tickIdx
                feeGrowthOutside0X128
                feeGrowthOutside1X128
              }
              tickUpper {
                tickIdx
                feeGrowthOutside0X128
                feeGrowthOutside1X128
              }
              token0 {
                id
                decimals
                name
                symbol
              }
              token1 {
                id
                decimals
                name
                symbol
              }
            }
          }
      `;
    
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

    const positionsData = response.data.data; // Get the first pool
    const positions = positionsData.positions;

    console.log("🚀 ~ getPositionsData ~ positions:", positions)

    return positions
        
  } catch (error) {
    console.error("Error fetching pool data:", error);
    return [];
}
}

// getPositionsData("0xbb4180ffe41310aeb15ef9410fd8c4c5b2ecb0e8");