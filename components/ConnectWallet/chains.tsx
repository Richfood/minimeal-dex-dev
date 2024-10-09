// Define NativeCurrency with a strict type for decimals
interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: 18;  // Literal type '18' instead of number
}

interface ChainInfo {
  urls: (string | undefined)[];
  name: string;
  nativeCurrency: NativeCurrency;
  blockExplorerUrls: string[];
  contract?: string;
}

const PLS: NativeCurrency = {
  name: 'PulseChain',
  symbol: 'PLS',
  decimals: 18,
};

const PLS_test: NativeCurrency = {
  name: 'Testnet v4',
  symbol: 'tPLS',
  decimals: 18,
};

export const CHAINS: Record<number, ChainInfo> = {
  369: {
    urls: [process.env.NEXT_PUBLIC_RPC].filter(Boolean) as string[],
    name: 'PulseChain',
    nativeCurrency: PLS,
    blockExplorerUrls: ['https://scan.pulsechain.com'],
    contract: process.env.NEXT_PUBLIC_SOIL_CONTRACT,
  },
  943: {
    urls: [process.env.NEXT_PUBLIC_RPC].filter(Boolean) as string[],
    name: 'Testnet v4',
    nativeCurrency: PLS_test,
    blockExplorerUrls: ['https://scan.v4.testnet.pulsechain.com'],
    contract: process.env.NEXT_PUBLIC_SOIL_CONTRACT,
  },
};

// Type guard to check if a chain has extended information
function isExtendedChainInformation(
  chainInformation: ChainInfo | undefined
): chainInformation is ChainInfo {
  return !!chainInformation?.nativeCurrency;
}

// Function to get the chain parameters for adding a network
export function getAddChainParameters(chainId: number): any {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId: chainId, // Ensure this is a number
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  }
  return chainId; // Ensure this is also a number
}


// Construct URLS object from CHAINS
export const URLS = Object.keys(CHAINS).reduce<Record<number, string[]>>(
  (accumulator, chainId) => {
    const validURLs = CHAINS[Number(chainId)]?.urls.filter((url): url is string => !!url) ?? [];

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  },
  {}
);
