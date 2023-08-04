import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

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
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  IdoPreSaleFactory,
  IdoPreSaleFactoryMethodNames,
  IdoPreSaleFactoryEventsContext,
  IdoPreSaleFactoryEvents
>;
export type IdoPreSaleFactoryEvents = 'IdoCreated' | 'OwnershipTransferred';
export interface IdoPreSaleFactoryEventsContext {
  IdoCreated(
    parameters: {
      filter?: {
        user?: string | string[];
        token?: string | string[];
        idoaddress?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  OwnershipTransferred(
    parameters: {
      filter?: {
        previousOwner?: string | string[];
        newOwner?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type IdoPreSaleFactoryMethodNames =
  | 'new'
  | 'createIDO'
  | 'getDeployedIdos'
  | 'getIdoByToken'
  | 'owner'
  | 'postFeepc'
  | 'preFee'
  | 'renounceOwnership'
  | 'setFeeWallet'
  | 'setPostFee'
  | 'setPreFee'
  | 'transferOwnership'
  | 'uniswapRouter';
export interface IdoCreatedEventEmittedResponse {
  user: string;
  token: string;
  idoaddress: string;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface CreateIDORequest {
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
export interface IdoPreSaleFactory {
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
   * @param _idopoolinfo Type: tuple, Indexed: false
   * @param raisetokenIn Type: address, Indexed: false
   */
  createIDO(
    _idopoolinfo: CreateIDORequest,
    raisetokenIn: string
  ): MethodPayableReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getDeployedIdos(): MethodConstantReturnContext<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenaddress Type: address, Indexed: false
   */
  getIdoByToken(_tokenaddress: string): MethodConstantReturnContext<string>;
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
