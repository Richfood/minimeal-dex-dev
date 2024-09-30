import { ChainId } from '@uniswap/sdk-core';
export declare const FACTORY_ADDRESS = "0xBEEc351d853eEAcF548121621755ec8dd5D5Ad07";
export declare const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export declare const POOL_INIT_CODE_HASH = "0x0dd3410144c2173dc7900464b7513a3085ba31a926905a23140234a82a858f43";
export declare function poolInitCodeHash(chainId?: ChainId): string;
/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export declare enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 2500,
    HIGH = 10000,
    HIGHEST = 20000
}
/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
    [amount in FeeAmount]: number;
};
