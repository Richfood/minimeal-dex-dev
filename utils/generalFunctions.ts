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