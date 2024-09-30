import {BigNumber} from "ethers";

export interface AddLiquidityPoolData {
  id : String,
  tick : String,
  ticks : {
    price0 : String,
    price1 : String
  },
  token0Price : String,
  token1Price : String
}

export interface SwapPoolData {
  id : String,
  liquidity : String,
  tick : String,
  token0Price : String,
  token1Price : String,
  feeTier : String,
}
  
export interface TokenDetails {
    name : string;
    symbol : string;
    address : string;
    decimals : number;
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
