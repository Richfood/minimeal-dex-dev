export function calculateV2Amounts (
    token0Amount = 0, 
    token1Amount = 0, 
    ratio : number
) {
    // ratio is amount0 / amount1;
    let resultantAmount : number;

    if(!token0Amount){
        resultantAmount = token1Amount * 1/ratio;
    }
    else{
        resultantAmount = ratio * token0Amount;
    }

    return resultantAmount;
}