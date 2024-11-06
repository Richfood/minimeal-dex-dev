import { TokenDetails } from "@/interfaces";
import { FeeAmount } from "@uniswap/v3-sdk";
import {ethers} from "ethers";
import axios from "axios";

export async function getV3PositionsData(): Promise<any> {
  try {
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const userAddress = await newSigner.getAddress();

      const subgraphUrl = "http://localhost:8000/subgraphs/name/pulsetest-error";
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
              }
              tickLower {
                feeGrowthOutside0X128
                feeGrowthOutside1X128
              }
              tickUpper {
                feeGrowthOutside0X128
                feeGrowthOutside1X128
              }
              token0 {
                decimals
                name
              }
              token1 {
                decimals
                name
              }
            }
          }
      `;
    
    const response = await axios.post(
      subgraphUrl,
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