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
export type ContractContext = Web3ContractContext<IdoPresale, IdoPresaleMethodNames, IdoPresaleEventsContext, IdoPresaleEvents>;
export type IdoPresaleEvents = 'AmountRefunded' | 'IdoUpdated' | 'OwnershipTransferred' | 'RemoveFromWhitelisted' | 'TokenDeposited' | 'TokensClaimed' | 'Whitelisted';
export interface IdoPresaleEventsContext {
    AmountRefunded(parameters: {
        filter?: {
            account?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    IdoUpdated(parameters: {
        filter?: {
            user?: string | string[];
            _MinBuyPerUser?: string | string[];
            _MaxBuyPerUse?: string | string[];
        };
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
    RemoveFromWhitelisted(parameters: {
        filter?: {
            account?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
    TokenDeposited(parameters: {
        filter?: {
            acount?: string | string[];
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
    Whitelisted(parameters: {
        filter?: {
            account?: string | string[];
        };
        fromBlock?: number;
        toBlock?: 'latest' | number;
        topics?: string[];
    }, callback?: (error: Error, event: EventData) => void): EventResponse;
}
export type IdoPresaleMethodNames = 'new' | 'addAddressesToWhitelist' | 'buyTokens' | 'buyTokensWithNative' | 'cancelIDO' | 'claimTokens' | 'createLiquidityPool' | 'getIdoDetails' | 'getIsFundClaimed' | 'isCancel' | 'isDexPoolAvailable' | 'isIdoSuccesful' | 'isWhitelisted' | 'owner' | 'raisetokenIn' | 'removeAddressesFromWhitelist' | 'renounceOwnership' | 'token' | 'totalTokenSold' | 'transferOwnership' | 'updateIdoInfo' | 'userRecord' | 'valueRaised' | 'whiteList' | 'withdrawRaisedFund';
export interface undefinedRequest {
    TokenAddress: string;
    TokenAllocation: string;
    TokenRate: string;
    SoftCap: string;
    HardCap: string;
    MinBuyPerUser: string;
    MaxBuyPerUser: string;
    StartTime: string;
    EndTime: string;
    DexListingRate: string;
    LiquidityPC: string;
    Refund: boolean;
    AutoListing: boolean;
    UseWhiteList: boolean;
}
export interface AmountRefundedEventEmittedResponse {
    account: string;
    amount: string;
}
export interface IdoUpdatedEventEmittedResponse {
    user: string;
    _MinBuyPerUser: string;
    _MaxBuyPerUse: string;
    _StartTime: string;
    _EndTime: string;
    _UseWhiteList: boolean;
}
export interface OwnershipTransferredEventEmittedResponse {
    previousOwner: string;
    newOwner: string;
}
export interface RemoveFromWhitelistedEventEmittedResponse {
    account: string;
}
export interface TokenDepositedEventEmittedResponse {
    acount: string;
    amount: string;
}
export interface TokensClaimedEventEmittedResponse {
    account: string;
    amount: string;
}
export interface WhitelistedEventEmittedResponse {
    account: string;
}
export interface IdopoolinfoResponse {
    TokenAddress: string;
    TokenAllocation: string;
    TokenRate: string;
    SoftCap: string;
    HardCap: string;
    MinBuyPerUser: string;
    MaxBuyPerUser: string;
    StartTime: string;
    EndTime: string;
    DexListingRate: string;
    LiquidityPC: string;
    Refund: boolean;
    AutoListing: boolean;
    UseWhiteList: boolean;
}
export interface UserRecordResponse {
    amountInvested: string;
    tokenToClaim: string;
    claimed: boolean;
}
export interface IdoPresale {
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: constructor
     * @param _idopoolinfo Type: tuple, Indexed: false
     * @param owner Type: address, Indexed: false
     * @param _raisetokenin Type: address, Indexed: false
     * @param _decimal Type: uint8, Indexed: false
     * @param _feewallet Type: address, Indexed: false
     * @param _postFeepc Type: uint8, Indexed: false
     * @param _factory_admin Type: address, Indexed: false
     * @param _uniswaprouter Type: address, Indexed: false
     */
    'new'(_idopoolinfo: undefinedRequest, owner: string, _raisetokenin: string, _decimal: string | number, _feewallet: string, _postFeepc: string | number, _factory_admin: string, _uniswaprouter: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param whitelistedAddresses Type: address[], Indexed: false
     */
    addAddressesToWhitelist(whitelistedAddresses: string[]): MethodReturnContext;
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
    cancelIDO(): MethodReturnContext;
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
    getIdoDetails(): MethodConstantReturnContext<IdopoolinfoResponse>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    getIsFundClaimed(): MethodConstantReturnContext<boolean>;
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
    isIdoSuccesful(): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param account Type: address, Indexed: false
     */
    isWhitelisted(account: string): MethodConstantReturnContext<boolean>;
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
     * @param whitelistedAddresses Type: address[], Indexed: false
     */
    removeAddressesFromWhitelist(whitelistedAddresses: string[]): MethodReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    totalTokenSold(): MethodConstantReturnContext<string>;
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
     * @param _MinBuyPerUser Type: uint256, Indexed: false
     * @param _MaxBuyPerUse Type: uint256, Indexed: false
     * @param _StartTime Type: uint256, Indexed: false
     * @param _EndTime Type: uint256, Indexed: false
     * @param _UseWhiteList Type: bool, Indexed: false
     */
    updateIdoInfo(_MinBuyPerUser: string, _MaxBuyPerUse: string, _StartTime: string, _EndTime: string, _UseWhiteList: boolean): MethodReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param parameter0 Type: address, Indexed: false
     */
    whiteList(parameter0: string): MethodConstantReturnContext<boolean>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    withdrawRaisedFund(): MethodReturnContext;
}
