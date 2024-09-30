const Q96 = 2 ** 96;

export function priceToTick(p : any) {
    return Math.floor(Math.log(p) / Math.log(1.0001));
}

export function tickToPrice(tick: number) {
    return Math.pow(1.0001, tick);
}

export function priceToSqrtPrice(p : any) {
    return BigInt(Math.floor(Math.sqrt(p) * Q96));
}

export function sqrtPriceToTick(p : any) {
    return Math.round(2 * Math.log(p / Q96) / Math.log(1.0001));
}

export function liquidity0(amount : any, pa : any, pb : any) {
    if (pa > pb) {
        [pa, pb] = [pb, pa];
    }
    return (amount * (pa * pb) / Q96) / (pb - pa);
}

export function liquidity1(amount : any, pa : any, pb : any) {
    if (pa > pb) {
        [pa, pb] = [pb, pa];
    }
    return (amount * Q96) / (pb - pa);
}

export function calculateAmount1WhenLiquidity0Given(liquidity0 : any, sqrtPriceCurrent : any, sqrtPriceLower : any) {
    return ((liquidity0 * Math.abs(sqrtPriceCurrent - sqrtPriceLower)) / Q96);
}

export function calculateAmount0WhenLiquidity1Given(liquidity1: any, sqrtPriceCurrent : any, sqrtPriceUpper : any ) {
    return ((liquidity1 * Math.abs(sqrtPriceCurrent - sqrtPriceUpper)) * Q96 / (sqrtPriceCurrent * sqrtPriceUpper));
}