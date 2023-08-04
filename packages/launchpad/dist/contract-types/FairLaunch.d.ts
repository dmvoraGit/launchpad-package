import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { PromiEvent, TransactionReceipt, EventResponse, EventData, Web3ContractContext } from 'ethereum-abi-types-generator';
export interface CallOptions {
    from?: string;
    gasPrice?: string;
    gas?: number;
}
export interface SendOptions {
    from: string;
    value?: number | string | BN | BigNumber;
    gasPrice?: string;
    gas?: number;
}
export interface EstimateGasOptions {
    from?: string;
    value?: number | string | BN | BigNumber;
    gas?: number;
}
export interface MethodPayableReturnContext {
    send(options: SendOptions): PromiEvent<TransactionReceipt>;
    send(options: SendOptions, callback: (error: Error, result: any) => void): PromiEvent<TransactionReceipt>;
    estimateGas(options: EstimateGasOptions): Promise<number>;
    estimateGas(options: EstimateGasOptions, callback: (error: Error, result: any) => void): Promise<number>;
    encodeABI(): string;
}
export interface MethodConstantReturnContext<TCallReturn> {
    call(): Promise<TCallReturn>;
    call(options: CallOptions): Promise<TCallReturn>;
    call(options: CallOptions, callback: (error: Error, result: TCallReturn) => void): Promise<TCallReturn>;
    encodeABI(): string;
}
export interface MethodReturnContext extends MethodPayableReturnContext {
}
export type ContractContext = Web3ContractContext<FairLaunch, FairLaunchMethodNames, FairLaunchEventsContext, FairLaunchEvents>;
export type FairLaunchEvents = 'AmountInvested' | 'AmountRefunded' | 'FLUpdated' | 'FairLaunchCanceled' | 'OwnershipTransferred' | 'TokensClaimed';
export interface FairLaunchEventsContext {
    AmountInvested(parameters: {
        filter?: {
            acount?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    AmountRefunded(parameters: {
        filter?: {
            account?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    FLUpdated(parameters: {
        filter?: {
            user?: string | string[];
            buylimit?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    FairLaunchCanceled(parameters: {
        filter?: {};
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    OwnershipTransferred(parameters: {
        filter?: {
            previousOwner?: string | string[];
            newOwner?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    TokensClaimed(parameters: {
        filter?: {
            account?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export type FairLaunchMethodNames = 'new' | 'buyTokens' | 'buyTokensWithNative' | 'cancelFairLaunch' | 'claimTokens' | 'createLiquidityPool' | 'getIdoDetails' | 'isCancel' | 'isDexPoolAvailable' | 'isFLSuccesful' | 'owner' | 'raisetokenIn' | 'renounceOwnership' | 'token' | 'transferOwnership' | 'updateFLInfo' | 'userRecord' | 'valueRaised' | 'withdrawRaisedFund';
export interface undefinedRequest {
    TokenAddress: string;
    TokenAllocation: string;
    SoftCap: string;
    BuyInLimit: boolean;
    BuyLimit: string;
    AutoListing: boolean;
    LiquidityPC: string;
    Refund: boolean;
    StartTime: string;
    EndTime: string;
}
export interface AmountInvestedEventEmittedResponse {
    acount: string;
    amount: string;
}
export interface AmountRefundedEventEmittedResponse {
    account: string;
    amount: string;
}
export interface FLUpdatedEventEmittedResponse {
    user: string;
    buylimit: string;
    _StartTime: string;
    _EndTime: string;
}
export interface OwnershipTransferredEventEmittedResponse {
    previousOwner: string;
    newOwner: string;
}
export interface TokensClaimedEventEmittedResponse {
    account: string;
    amount: string;
}
export interface FairlaunchinfoResponse {
    TokenAddress: string;
    TokenAllocation: string;
    SoftCap: string;
    BuyInLimit: boolean;
    BuyLimit: string;
    AutoListing: boolean;
    LiquidityPC: string;
    Refund: boolean;
    StartTime: string;
    EndTime: string;
}
export interface UserRecordResponse {
    amountInvested: string;
    claimed: boolean;
}
export interface FairLaunch {
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: constructor
     * @param _flInfo Type: tuple, Indexed: false
     * @param owner Type: address, Indexed: false
     * @param _raisetokenin Type: address, Indexed: false
     * @param _feewallet Type: address, Indexed: false
     * @param _postFeepc Type: uint8, Indexed: false
     * @param _factory_admin Type: address, Indexed: false
     * @param _uniswaprouter Type: address, Indexed: false
     */
    'new'(_flInfo: undefinedRequest, owner: string, _raisetokenin: string, _feewallet: string, _postFeepc: string | number, _factory_admin: string, _uniswaprouter: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _amount Type: uint256, Indexed: false
     */
    buyTokens(_amount: string): MethodReturnContext;
    /**
     * Payable: true
     * Constant: false
     * StateMutability: payable
     * Type: function
     */
    buyTokensWithNative(): MethodPayableReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    cancelFairLaunch(): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    claimTokens(): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    createLiquidityPool(): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    getIdoDetails(): MethodConstantReturnContext<FairlaunchinfoResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    isCancel(): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    isDexPoolAvailable(): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    isFLSuccesful(): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    owner(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    raisetokenIn(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    renounceOwnership(): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    token(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param newOwner Type: address, Indexed: false
     */
    transferOwnership(newOwner: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _buyinlimit Type: bool, Indexed: false
     * @param _buylimit Type: uint256, Indexed: false
     * @param _StartTime Type: uint256, Indexed: false
     * @param _EndTime Type: uint256, Indexed: false
     */
    updateFLInfo(_buyinlimit: boolean, _buylimit: string, _StartTime: string, _EndTime: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     */
    userRecord(parameter0: string): MethodConstantReturnContext<UserRecordResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    valueRaised(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    withdrawRaisedFund(): MethodReturnContext;
}
