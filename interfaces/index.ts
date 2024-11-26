import { BigNumber } from "ethers";

export interface AddLiquidityPoolData {
  id: String,
  tick: String,
  ticks: {
    price0: String,
    price1: String
  },
  token0: {
    decimals: number,
    name: string
  },
  token1: {
    decimals: number,
    name: string
  },
  token0Price: String,
  token1Price: String
}

export interface SwapPoolData {
  id: String,
  liquidity: String,
  tick: String,
  token0Price: String,
  token1Price: String,
  feeTier: String,
}

export interface V3PositionData {
  id: string;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  collectedFeesToken0: string;
  collectedFeesToken1: string;
  depositedToken0: string;
  depositedToken1: string;
  withdrawnToken0: string;
  withdrawnToken1: string;
  pool: {
    feeTier: string
    tick: string
    feeGrowthGlobal0X128: string;
    feeGrowthGlobal1X128: string;
    token0Price: string
  };
  tickLower: {
    tickIdx: string
    feeGrowthOutside0X128: string;
    feeGrowthOutside1X128: string;
  };
  tickUpper: {
    tickIdx: string
    feeGrowthOutside0X128: string;
    feeGrowthOutside1X128: string;
  };
  token0: {
    decimals: string;
    name: string;
    symbol : string;
    id: string
  };
  token1: {
    decimals: string;
    name: string;
    symbol : string;
    id : string
  };
}

export interface V2PositionsData {
  liquidity : string,
  pair: {
    token0Price : string
    token0: {
        id: string
        name: string
        symbol: string
        decimals: string
    },
    token1: {
        id: string,
        name: string,
        symbol: string
        decimals: string
    },
    totalSupply: string,
    id: string
  }
  timestamp: string
}


export interface TokenDetails {
  name: string;
  symbol: string;
  address: {
    contract_address: string;
    decimals: number;
  };
  logoURI?: string;
  chainId?: number;

}

export interface PoolDetails {
  sqrtPriceX96: BigNumber | string;
  liquidity: BigNumber | string;
  tick: number;
  fee: number;
}

export enum Protocol {
  V2 = "V2",
  V3 = "V3",
  MIXED = "MIXED"
}
