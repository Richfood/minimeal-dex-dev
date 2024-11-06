import { TokenDetails } from "@/interfaces";
import { FeeAmount } from "@uniswap/v3-sdk";
import {ethers} from "ethers";
import axios from "axios";

export async function getV2Positions(): Promise<any> {
  try {
    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
    const newSigner = newProvider.getSigner();
    const userAddress = await newSigner.getAddress();

      const subgraphUrl = "http://127.0.0.1:8000/subgraphs/name/subgraph-v2";
      const query = `
        query {
            userPositionSnapshots(
              orderBy: timestamp, 
              orderDirection: desc,
              where: {userAddress: "${userAddress}"}
            ) {
            liquidity
            pair {
                token0 {
                    id
                    name
                }
                token1 {
                    id
                    name
                }
                totalSupply
                id
            }
            timestamp
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
    let positions = positionsData.userPositionSnapshots;

    positions = positions.filter((position : any)=>{
      return position.liquidity !== "0";
    })

    console.log("🚀 ~ V2 positions", positions)

    return positions
        
  } catch (error) {
    console.error("Error fetching pool data:", error);
    return [];
}
}

// getPositionsData("0xbb4180ffe41310aeb15ef9410fd8c4c5b2ecb0e8");