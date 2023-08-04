declare global {
    interface Window {
        web3: any;
        ethereum: any;
    }
}
import BigNumber from "bignumber.js";
export declare const isMetaMaskInstalled: () => boolean;
export declare const toWei: (amount: string | number, decimals?: number) => string;
export declare const fromWei: (amount: string | number, decimals?: number) => string | null;
export declare const calCulateOutputTokenAmount: (amount: string | number, tokenrate: string | number, decimals?: number) => string | null;
export declare const revertedError: (error: Error | any, index?: number) => any;
export declare const tokenInfo: ({ address }: {
    address: string;
}) => Promise<any>;
export declare const checkEnoughTokens: (tokens: number | string, hardCap: number | string, tokenrate: number | string, decimals?: number) => boolean | null;
export declare const tokenAmount: (hardCap: string | number, tokenrate: string | number, decimals?: number) => false | BigNumber | null;
export declare const getNativeBalance: (address: string) => Promise<string>;
export declare const formatLargeNumber: (value: number, precision?: number) => any;
export declare const resetCurrencyFormatting: (value: string) => string;
export declare const isNumber: (value: any) => boolean;
export declare const formatCurrency: (value: number, usd?: boolean, fractionDigits?: number, currencyFormat?: boolean) => any;
export declare const unixTimeStamp: (date: any) => number;
export declare const getTotalAmountOfApproveForPresale: ({ tokenRate, hardCap, liquidityPc, LiquidityRate, }: {
    tokenRate: string | number;
    hardCap: string | number;
    liquidityPc: string | number;
    LiquidityRate: string | number;
}) => string;
export declare const getTotalAmountOfApproveForFairLaunch: ({ tokenForsale, liquidityPc, }: {
    tokenForsale: string | number;
    liquidityPc: string | number;
}) => string;
