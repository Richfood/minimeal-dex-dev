import { TokenDetails } from "@/interfaces";

export const truncateAddress = (address: any): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function roundToPrecision(value: string, decimals:number) {
    const factor = Math.pow(10, decimals);
    const roundedValue = Number(((parseFloat(value) * factor) / factor).toFixed(0));
    return BigInt(roundedValue);
}

export function adjustForSlippage(amount: string, slippageTolerance: number): number {
    const slippageFactor = slippageTolerance / 100;
    return Number(amount) * slippageFactor;
}   

export function decimalRound(value : string, decimal: number){
    return (parseFloat(Number(value).toFixed(decimal))).toString()
}

export function expandIfNeeded(numStr : string) {
    if (!/[eE]/.test(numStr)) {
      return numStr;
    }
  
    let data = numStr.split(/[eE]/);
    let base = data[0];
    let exponent = parseInt(data[1]);
  
    if (exponent > 0) {
      return base.replace('.', '') + '0'.repeat(exponent - (base.split('.')[1]?.length || 0));
    } else {
      const decimalPlaces = Math.abs(exponent);
      const [whole, decimal] = base.split('.');
      return '0.' + '0'.repeat(decimalPlaces - 1) + whole.replace('.', '') + (decimal || '');
    }
}

export function isNative(token: TokenDetails): boolean{
  return token.symbol === "PLS";
}