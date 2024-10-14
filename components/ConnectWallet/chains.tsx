interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
  }
  
  interface ExtendedChainInformation {
    urls: string[];
    name: string;
    nativeCurrency: NativeCurrency;
    blockExplorerUrls: string[];
    contract: string | undefined;
  }
  
  interface BasicChainInformation {
    urls: string[];
  }
  
  type ChainInformation = ExtendedChainInformation | BasicChainInformation;
  
  function isExtendedChainInformation(
    chainInformation: ChainInformation
  ): chainInformation is ExtendedChainInformation {
    return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
  }
  
  export function getAddChainParameters(chainId: number): number | object {
    const chainInformation = CHAINS[chainId];
  
    if (isExtendedChainInformation(chainInformation)) {
      return {
        chainId,
        chainName: chainInformation.name,
        nativeCurrency: chainInformation.nativeCurrency,
        rpcUrls: chainInformation.urls,
        blockExplorerUrls: chainInformation.blockExplorerUrls,
      };
    } else {
      return chainId;
    }
  }
  
  export const PLS: NativeCurrency = {
    name: 'PulseChain',
    symbol: 'PLS',
    decimals: 18,
  };
  
  export const PLS_test: NativeCurrency = {
    name: 'Testnet v4',
    symbol: 'tPLS',
    decimals: 18,
  };
  
  export const CHAINS: Record<number, ChainInformation> = {
    369: {
      urls: [process.env.NEXT_PUBLIC_RPC || ''].filter(Boolean),
      name: 'PulseChain',
      nativeCurrency: PLS,
      blockExplorerUrls: ['https://scan.pulsechain.com'],
      contract: process.env.NEXT_PUBLIC_SOIL_CONTRACT,
    },
    943: {
      urls: [process.env.NEXT_PUBLIC_RPC || ''].filter(Boolean),
      name: 'Testnet v4',
      nativeCurrency: PLS_test,
      blockExplorerUrls: ['https://scan.v4.testnet.pulsechain.com'],
      contract: process.env.NEXT_PUBLIC_SOIL_CONTRACT,
    },
  };
  
  export const URLS: Record<number, string[]> = Object.keys(CHAINS).reduce(
    (accumulator: Record<number, string[]>, chainId: string) => {
      const validURLs = CHAINS[Number(chainId)].urls;
  
      if (validURLs.length) {
        accumulator[Number(chainId)] = validURLs;
      }
  
      return accumulator;
    },
    {}
  );
  