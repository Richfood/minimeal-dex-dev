const axios = require('axios');

export async function getTokenUsdPrice(tokenAddress: string) {
  if (!tokenAddress) return null;

  const url = 'https://graphql.piteas.io/graphql';
  const query = `
    query TokenSpotPrice($chain: Chain!, $address: String) {
      tokenPrice(chain: $chain, address: $address) {
        id
        address
        chain
        name
        symbol
        price {
          value
        }
      }
    }
  `;

  const variables = {
    chain: "PULSE",  // Ensure "PULSE" is a valid chain in API docs
    address: tokenAddress.toLowerCase(),
  };

  try {
    const response = await axios.post(
      url,
      { query, variables },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("🚀 ~ getTokenUsdPrice ~ response:", response.data);

    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors);
      return null;  // Handle GraphQL-level errors gracefully
    }

    const tokenPrice = response.data.data?.tokenPrice?.price?.value;
    return tokenPrice ?? null;  // Handle null safely
  } catch (error:any) {
    console.error('Error fetching token price:', error.message);
    return null;
  }
}
