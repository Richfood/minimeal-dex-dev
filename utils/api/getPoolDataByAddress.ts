import axios from "axios";

export async function getPoolDataByAddress(poolAddress: string): Promise<any> {
    console.log("🚀 ~ getPoolDataByAddress ~ poolAddress:", poolAddress)

    const subgraphUrl = process.env.NEXT_PUBLIC_V3_SUBGRAPH_API;
    console.log("🚀 ~ getPoolDataByAddress ~ subgraphUrl:", subgraphUrl)
    const query = `
              query {
        pools(
          where: {
            id: "${poolAddress.toLowerCase()}", 
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
        console.log("🚀 ~ getPoolDataByAddress ~ response:", response)

        if (response.data.errors) {
            console.log("🚀 ~ getPoolDataByAddress ~ response.data:", response.data)
            throw new Error(JSON.stringify(response.data.errors));
        }

        const allPools = response.data.data.pools; // Get the first pool
        console.log("🚀 ~ getPoolDataByAddress ~ allPools:", allPools)

        return allPools;
    } catch (error) {
        console.error("Error fetching pool data:", error);
        return null;
    }
}