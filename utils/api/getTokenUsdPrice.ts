const axios = require('axios');

export async function getTokenUsdPrice(tokenAddress : string|undefined) {

  if(!tokenAddress) return null;

  const url = 'https://graphql.piteas.io/graphql';
  const query = `
    query TokenSpotPrice($chain: Chain!, $address: String = null) {
      tokenPrice(chain: $chain, address: $address) {
        id
        address
        chain
        name
        symbol
        price {
          id
          value
          __typename
        }
        __typename
      }
    }
  `;

  const variables = {
    address: `${tokenAddress.toLowerCase()}`,
    chain: "PULSE"
  };

  try {
    const response = await axios.post(url, {
      query: query,
      variables: variables,
      operationName: "TokenSpotPrice"
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data.data.tokenPrice.price.value;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}


