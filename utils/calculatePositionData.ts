import { V3PositionData } from "@/interfaces";
import { BigNumber, ethers } from "ethers";

function feeGrowthInsideX128(
    lowerFeeGrowthOutsideX128: BigNumber,
    upperFeeGrowthOutside0X128: BigNumber,
    feeGrowthGlobalX128: BigNumber
  ): string {
    // Adjust fee growth to exclude any fees that have accumulated outside the position range
    return feeGrowthGlobalX128
      .sub(lowerFeeGrowthOutsideX128)
      .sub(upperFeeGrowthOutside0X128)
      .toString(); // Convert to string before returning
  }
  
  function calculateFeesEarned(
    liquidity: BigNumber,
    feeGrowthInsideX128: BigNumber,
    feeGrowthInsideLastX128: BigNumber
  ): string {
    // The difference in fee growth since the last time fees were collected
    const feeGrowthDifferenceX128 = feeGrowthInsideX128.sub(feeGrowthInsideLastX128);
    
    // Calculate the fees earned by the position and convert to string
    return liquidity.mul(feeGrowthDifferenceX128).div(BigNumber.from(2).pow(128)).toString();
  }
  
  function humanReadableFees(feesRaw: BigNumber, tokenDecimals: number): string {
    return feesRaw.div(BigNumber.from(10).pow(tokenDecimals)).toString(); // Convert to string before returning
  }
  

export function calculatePositionData(position : V3PositionData){
// console.log("🚀 ~ calculatePositionData ~ position:", position)

    // Fetch necessary data: liquidity, feeGrowthInsideLastX128, etc.
const liquidity = position.liquidity;
console.log("🚀 ~ calculatePositionData ~ liquidity:", liquidity)
const feeGrowthInside0LastX128 = position.feeGrowthInside0LastX128;
console.log("🚀 ~ calculatePositionData ~ feeGrowthInside0LastX128:", feeGrowthInside0LastX128)
const feeGrowthInside1LastX128 = position.feeGrowthInside1LastX128;
console.log("🚀 ~ calculatePositionData ~ feeGrowthInside1LastX128:", feeGrowthInside1LastX128)

// Get global pool data
const feeGrowthGlobal0X128 = position.pool.feeGrowthGlobal0X128;
console.log("🚀 ~ calculatePositionData ~ feeGrowthGlobal0X128:", feeGrowthGlobal0X128)
const feeGrowthGlobal1X128 = position.pool.feeGrowthGlobal1X128;
console.log("🚀 ~ calculatePositionData ~ feeGrowthGlobal1X128:", feeGrowthGlobal1X128)

// Get tick data (e.g., from subgraph or chain call)
const tickLowerData = position.tickLower;
console.log("🚀 ~ calculatePositionData ~ tickLowerData:", tickLowerData)
const tickUpperData = position.tickUpper;
console.log("🚀 ~ calculatePositionData ~ tickUpperData:", tickUpperData)

// Calculate the current fee growth inside the position's tick range
const feeGrowthInside0X128 = feeGrowthInsideX128(BigNumber.from(tickLowerData.feeGrowthOutside0X128), BigNumber.from(tickUpperData.feeGrowthOutside0X128), BigNumber.from(feeGrowthGlobal0X128));
console.log("🚀 ~ calculatePositionData ~ feeGrowthInside0X128:", feeGrowthInside0X128)
const feeGrowthInside1X128 = feeGrowthInsideX128(BigNumber.from(tickLowerData.feeGrowthOutside1X128), BigNumber.from(tickUpperData.feeGrowthOutside1X128), BigNumber.from(feeGrowthGlobal1X128));
console.log("🚀 ~ calculatePositionData ~ feeGrowthInside1X128:", feeGrowthInside1X128)

// Calculate fees earned
const feesEarnedToken0 = calculateFeesEarned(BigNumber.from(liquidity), BigNumber.from(feeGrowthInside0X128), BigNumber.from(feeGrowthInside0LastX128));
console.log("🚀 ~ calculatePositionData ~ feesEarnedToken0:", feesEarnedToken0)
const feesEarnedToken1 = calculateFeesEarned(BigNumber.from(liquidity), BigNumber.from(feeGrowthInside1X128), BigNumber.from(feeGrowthInside1LastX128));
console.log("🚀 ~ calculatePositionData ~ feesEarnedToken1:", feesEarnedToken1)

// Convert to human-readable amounts
const humanReadableFeesToken0 = humanReadableFees(BigNumber.from(feesEarnedToken0), Number(position.token0.decimals));
console.log("🚀 ~ calculatePositionData ~ humanReadableFeesToken0:", humanReadableFeesToken0)
const humanReadableFeesToken1 = humanReadableFees(BigNumber.from(feesEarnedToken1), Number(position.token1.decimals));
console.log("🚀 ~ calculatePositionData ~ humanReadableFeesToken1:", humanReadableFeesToken1)



    return {humanReadableFeesToken0, humanReadableFeesToken1};
}