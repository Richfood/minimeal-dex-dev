const Q96 = bigIntPow(BigInt(2), BigInt(96));

// Helper function for BigInt exponentiation
function bigIntPow(base: bigint, exp: bigint): bigint {
    let result = BigInt(1);
    while (exp > 0) {
        if (exp % BigInt(2) === BigInt(1)) {
            result *= base;
        }
        base *= base;
        exp /= BigInt(2);
    }
    return result;
}

// Returns a number (as tick is a floating-point value in the original logic)
export function priceToTick(p: number | string, decimalDifference: number): number {
    p = Number(p);
    const factor = Math.pow(10, decimalDifference);
    p = p * factor;

    return Math.floor(Math.log(p) / Math.log(1.0001));
}


// Returns a number (as price is a floating-point value in the original logic)
export function tickToPrice(tick: number, decimalDifference: number): number {
    const factor = Math.pow(10, decimalDifference);  // Use number to keep consistency
    let price = Math.pow(1.0001, tick);
    price = price / factor;

    return price;
}

// Returns a BigInt (as the original return was likely a large integer)
export function priceToSqrtPrice(p: bigint): bigint {
    return BigInt(Math.floor(Math.sqrt(Number(p)) * Number(Q96)));
}

// Returns a number (since tick calculations typically return a floating-point value)
export function sqrtPriceToTick(p: bigint): number {
    return Math.round(2 * Math.log(Number(p / Q96)) / Math.log(1.0001));
}

// Returns a BigInt (liquidity should be handled with large integers)
export function liquidity0(amount: bigint | string, pa: bigint | string, pb: bigint | string): bigint {

    amount = BigInt(amount);
    pa = BigInt(pa);
    pb = BigInt(pb);

    if (pa > pb) {
        [pa, pb] = [pb, pa];
    }
    return (amount * (pa * pb) / Q96) / (pb - pa);
}

// Returns a BigInt (liquidity should be handled with large integers)
export function liquidity1(amount: bigint | string, pa: bigint | string, pb: bigint | string): bigint {

    amount = BigInt(amount);
    pa = BigInt(pa);
    pb = BigInt(pb);

    if (pa > pb) {
        [pa, pb] = [pb, pa];
    }
    return (amount * Q96) / (pb - pa);
}

// Returns a number (as the original return seems to be an amount, which is a float)
export function calculateAmount1WhenLiquidity0Given(
    liquidity0: bigint,
    sqrtPriceCurrent: bigint | string,
    sqrtPriceLower: bigint | string
): bigint {

    sqrtPriceCurrent = BigInt(sqrtPriceCurrent);
    sqrtPriceLower = BigInt(sqrtPriceLower);

    return (liquidity0 * BigInt(Math.abs(Number(sqrtPriceCurrent - sqrtPriceLower)))) / Q96;
}

// Returns a number (as the original return seems to be an amount, which is a float)
export function calculateAmount0WhenLiquidity1Given(
    liquidity1: bigint,
    sqrtPriceCurrent: bigint | string,
    sqrtPriceUpper: bigint | string
): bigint {

    sqrtPriceCurrent = BigInt(sqrtPriceCurrent);
    sqrtPriceUpper = BigInt(sqrtPriceUpper);

    return ((liquidity1 * BigInt(Math.abs(Number(sqrtPriceCurrent - sqrtPriceUpper)))) * Q96) / (sqrtPriceCurrent * sqrtPriceUpper);
}
