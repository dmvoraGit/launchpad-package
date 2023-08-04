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
export type ContractContext = Web3ContractContext<FairLaunchFactory, FairLaunchFactoryMethodNames, FairLaunchFactoryEventsContext, FairLaunchFactoryEvents>;
export type FairLaunchFactoryEvents = 'FLCreated' | 'OwnershipTransferred';
export interface FairLaunchFactoryEventsContext {
    FLCreated(parameters: {
        filter?: {
            user?: string | string[];
            token?: string | string[];
            FLaddress?: string | string[];
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
}
export type FairLaunchFactoryMethodNames = 'new' | 'createIDO' | 'getDeployedFLs' | 'getFLByToken' | 'owner' | 'postFeepc' | 'preFee' | 'renounceOwnership' | 'setFeeWallet' | 'setPostFee' | 'setPreFee' | 'transferOwnership' | 'uniswapRouter';
export interface FLCreatedEventEmittedResponse {
    user: string;
    token: string;
    FLaddress: string;
}
export interface OwnershipTransferredEventEmittedResponse {
    previousOwner: string;
    newOwner: string;
}
export interface CreateIDORequest {
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
export interface FairLaunchFactory {
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: constructor
     * @param _uniswapRouter Type: address, Indexed: false
     */
    'new'(_uniswapRouter: string): MethodReturnContext;
    /**
     * Payable: true
     * Constant: false
     * StateMutability: payable
     * Type: function
     * @param _flinfo Type: tuple, Indexed: false
     * @param raisetokenIn Type: address, Indexed: false
     */
    createIDO(_flinfo: CreateIDORequest, raisetokenIn: string): MethodPayableReturnContext;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    getDeployedFLs(): MethodConstantReturnContext<string[]>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     * @param _tokenaddress Type: address, Indexed: false
     */
    getFLByToken(_tokenaddress: string): MethodConstantReturnContext<string>;
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
    postFeepc(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    preFee(): MethodConstantReturnContext<string>;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     */
    renounceOwnership(): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _feewallet Type: address, Indexed: false
     */
    setFeeWallet(_feewallet: string): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _fee Type: uint8, Indexed: false
     */
    setPostFee(_fee: string | number): MethodReturnContext;
    /**
     * Payable: false
     * Constant: false
     * StateMutability: nonpayable
     * Type: function
     * @param _fee Type: uint256, Indexed: false
     */
    setPreFee(_fee: string): MethodReturnContext;
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
     * Constant: true
     * StateMutability: view
     * Type: function
     */
    uniswapRouter(): MethodConstantReturnContext<string>;
}
