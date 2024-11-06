export function calculateV2Amounts (
    token0Amount = 0, 
    token1Amount = 0, 
    ratio : number,
    isSorted : boolean
) {

    if(!isSorted){
        const temp = token0Amount;
        token0Amount = token1Amount;
        token1Amount = temp;
    }

    let resultantAmount : number;

    if(!token0Amount){
        resultantAmount = token1Amount * 1/ratio;
    }
    else{
        resultantAmount = ratio * token0Amount;
    }

    return resultantAmount;
}