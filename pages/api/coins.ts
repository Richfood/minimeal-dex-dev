// pages/api/fetch-coingecko.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

interface CoinGeckoResponse {
    name: string;
    symbol: string;
    image: {
        thumb?: string; // Optional since it might not be present
    }
    detail_platforms?: {
        ethereum?: string; // Optional Ethereum address in detail platforms
        pulsechain?: string; // Optional PulseChain address in detail platforms
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { idsArray } = req.body;

    // Check if idsArray is valid
    if (!idsArray || !Array.isArray(idsArray)) {
        return res.status(400).json({ error: 'Invalid idsArray' });
    }

    const baseURL = 'https://api.coingecko.com/api/v3/coins/';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            // Remove API key if not required
            // 'x-cg-api-key': 'YOUR_API_KEY', // Replace with API key if using paid plan
        },
    };

    try {
        // Fetch data for up to 10 coins
        const responses = await Promise.all(
            idsArray.slice(0, 10).map(async (id: string) => {
                const url = `${baseURL}${id}`;
                const response = await fetch(url, options);

                if (!response.ok) {
                    console.error(`Failed to fetch data for ${id}: ${response.statusText}`);
                    return null;
                }

                // Use 'as' to assert the type of data
                const data = (await response.json()) as CoinGeckoResponse;

                return {
                    name: data.name,
                    symbol: data.symbol,
                    image: data.image?.thumb || null, // Fallback to null if no image
                    address: data.detail_platforms?.pulsechain, // Ethereum address or null
                };
            })
        );

        // Filter out any null responses
        const filteredResponses = responses.filter((response) => response !== null);

        // Send back the filtered data
        res.status(200).json(filteredResponses);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
