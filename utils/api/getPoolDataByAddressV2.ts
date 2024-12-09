import { V2PairData } from "@/interfaces";
import axios from "axios";

export async function getPoolDataByAddressV2(poolAddress: string): Promise<V2PairData | null> {
    console.log("🚀 ~ getPoolDataByAddress ~ poolAddress:", poolAddress)

    const subgraphUrl = process.env.NEXT_PUBLIC_V2_SUBGRAPH_API;
    console.log("🚀 ~ getPoolDataByAddress ~ subgraphUrl:", subgraphUrl)
    const query = `
        query {
            pairs(
                where: {
                    id: "${poolAddress.toLowerCase()}", 
                }
            )   {
                    token0Price
                    token1Price
                    token0 {
                        id
                        name
                        symbol
                        decimals
                    }
                    token1 {
                        id
                        name
                        symbol
                        decimals
                    }
                    totalSupply
                    id
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
        console.log("🚀 ~ getPoolDataByAddress ~ response:", response)

        if (response.data.errors) {
            console.log("🚀 ~ getPoolDataByAddress ~ response.data:", response.data)
            throw new Error(JSON.stringify(response.data.errors));
        }

        const allPools = response.data.data.pairs[0]; // Get the first pool
        console.log("🚀 ~ getPoolDataByAddress ~ allPools:", allPools)

        return allPools;
    } catch (error) {
        console.error("Error fetching pool data:", error);
        return null;
    }
}