const Q96 = 2 ** 96;

export function priceToTick(p : any, decimalDifference : number) {

    const factor = Math.pow(10,decimalDifference);
    p = p*factor;

    return Math.floor(Math.log(p) / Math.log(1.0001));
}

export function tickToPrice(tick: number, decimalDifference : number) {
    const factor = Math.pow(10, decimalDifference);
    let price = Math.pow(1.0001, tick);
    price = price/factor;

    return price;
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
    // const decimalRatio = Math.sqrt(Math.pow(10,decimalDifference))
    return Math.round((liquidity0 * Math.abs(sqrtPriceCurrent - sqrtPriceLower)) / (Q96 /* * decimalRatio */));
}

export function calculateAmount0WhenLiquidity1Given(liquidity1: any, sqrtPriceCurrent : any, sqrtPriceUpper : any) {
    // const decimalRatio = Math.sqrt(Math.pow(10,decimalDifference))
    return Math.round(((liquidity1 * Math.abs(sqrtPriceCurrent - sqrtPriceUpper)) * Q96 /* * decimalRatio */) / (sqrtPriceCurrent * sqrtPriceUpper));
}