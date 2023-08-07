import React, {
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from "react";
import { Action, ActionType } from "./actions-types";
import {
	getErc20Contract,
	getFairLaunchFactoryContract,
	getFairlaunchContract,
	getPresaleContract,
	getPresaleFactoryContract,
} from "../contract";
import {
	getTotalAmountOfApproveForFairLaunch,
	getTotalAmountOfApproveForPresale,
	revertedError,
	toWei,
	unixTimeStamp,
} from "@logisticinfotechs/web3-utils";
import { CreateIDORequest } from "../contract-types/IdoPreSaleFactory";
import { CreateIDORequest as FairlaunchRequest } from "../contract-types/FairLaunchFactory";
import {
	AllowanceParams,
	BuyToken,
	ContractAddresses,
	CreateIdoPayload,
	IdoDetailsParams,
	OfferType,
	PoolInfoType,
} from "./types";

interface IIDoState {
	loading?: boolean;
	transaction?: {
		type: null | string; // swap/ add_liquidity, remove_liquidity
		hash: null | string;
		status: null | string; // pending, success, failed
		result: any;
	};
	error?: null | string;
	postFee?: string | null;
	preFee?: string;
	contractAddress?: ContractAddresses | null;
	poolInfo?: PoolInfoType;
	allowance?: string;
}

export enum TRANSACTIONSTATUS {
	PENDING = "PENDING",
	FAILED = "FAILED",
	SUCCESS = "SUCCESS",
}

export enum TRANSACTIONTYPE {
	CREATEIDO = "CREATEIDO",
	APPROVE = "APPROVE",
	BUYTOKEN = "BUYTOKEN",
}

const IdoContext = createContext({});

export const IdoProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const initialState: IIDoState = {
		loading: false,
		transaction: {
			type: null,
			hash: null,
			status: null,
			result: null,
		},
		error: null,
		postFee: null,
		preFee: "0",
		contractAddress: null,
		allowance: "0",
	};

	const reducer = (state: IIDoState, action: Action) => {
		switch (action.type) {
			case ActionType.SETADDRESS:
				return {
					...state,
					contractAddress: {
						...state.contractAddress,
						...action.payload,
					},
				};
			case ActionType.STARTLOADING: {
				return {
					...state,
					loading: true,
				};
			}
			case ActionType.STOPLOADING: {
				return {
					...state,
					loading: false,
				};
			}
			case ActionType.SETTRANSACTION: {
				return {
					...state,
					transaction: {
						...state.transaction,
						...action.payload,
					},
				};
			}
			case ActionType.SETPOOL: {
				return {
					...state,
					poolInfo: {
						...state.poolInfo,
						...action.payload,
					},
				};
			}
			case ActionType.SETALLOWANCE: {
				return {
					...state,
					allowance: action.payload,
				};
			}
			default:
				return {
					...state,
				};
		}
	};

	const [state, dispatch] = useReducer(reducer, initialState);

	const setContractAddress = (payload: ContractAddresses) => {
		dispatch({
			type: ActionType.SETADDRESS,
			payload,
		});
	};

	const checkAllowance = async ({
		tokenAddress,
		ownwer,
		spender,
	}: AllowanceParams) => {
		try {
			dispatch({
				type: ActionType.STARTLOADING,
			});
			const _contract = getErc20Contract(tokenAddress);
			const result = await _contract.methods
				.allowance(ownwer, spender)
				.call();
			dispatch({
				type: ActionType.SETALLOWANCE,
				payload: result?.toString() || "0",
			});
		} catch (err) {
			console.log("err", err);
		} finally {
			dispatch({
				type: ActionType.STOPLOADING,
			});
		}
	};

	const approveToken = async ({
		tokenAddress,
		ownwer,
		spender,
		amount,
	}: AllowanceParams & {
		amount: string;
	}) => {
		try {
			dispatch({
				type: ActionType.STARTLOADING,
			});
			const _contract = getErc20Contract(tokenAddress);
			await _contract.methods
				.approve(spender, amount)
				.send({ from: ownwer }, function (error, transactionHash) {
					if (error) {
						dispatch({
							type: ActionType.STARTLOADING,
						});
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.APPROVE,
								hash: null,
								status: TRANSACTIONSTATUS.FAILED,
								result: {},
							},
						});
					} else {
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.APPROVE,
								hash: transactionHash,
								status: TRANSACTIONSTATUS.PENDING,
								result: {},
							},
						});
					}
				})
				.on("receipt", async function (receipt) {
					console.log("receipt", receipt);
					dispatch({
						type: ActionType.SETTRANSACTION,
						payload: {
							type: TRANSACTIONTYPE.APPROVE,
							hash: null,
							status: TRANSACTIONSTATUS.SUCCESS,
							result: receipt,
						},
					});
					await checkAllowance({ tokenAddress, ownwer, spender });
				})
				.on("error", async function (error) {
					console.log("error", error);
					dispatch({
						type: ActionType.SETTRANSACTION,
						payload: {
							type: TRANSACTIONTYPE.APPROVE,
							hash: null,
							status: TRANSACTIONSTATUS.FAILED,
							result: null,
						},
					});
				});
		} catch (err) {
			console.log("err", err);
		} finally {
			dispatch({
				type: ActionType.STARTLOADING,
			});
		}
	};

	const getIdoDetails = async ({
		idoAddress,
		account,
		idoType,
	}: IdoDetailsParams) => {
		try {
			dispatch({
				type: ActionType.STARTLOADING,
			});
			if (!idoAddress || !account || !idoType) return;
			let _idoContract;
			let totalTokenSold;
			if (idoType === OfferType.PRESALE) {
				_idoContract = getPresaleContract(idoAddress);
				totalTokenSold = await _idoContract.methods
					.totalTokenSold()
					.call();
			} else {
				_idoContract = getFairlaunchContract(idoAddress);
			}
			const [valueRaised, pool, userInfo] = await Promise.all([
				_idoContract.methods.valueRaised().call(),
				_idoContract.methods.getIdoDetails().call(),
				_idoContract.methods.userRecord(account).call(),
			]);

			dispatch({
				type: ActionType.SETPOOL,
				payload: {
					valueRaised,
					totalTokenSold,
					pool: { ...pool },
					userInfo,
				},
			});
		} catch (err: Error | any) {
			console.log("err", err);
		} finally {
			dispatch({
				type: ActionType.STOPLOADING,
			});
		}
	};

	//create ido
	const createIdo = async (params: CreateIdoPayload) => {
		try {
			dispatch({ type: ActionType.STARTLOADING });
			if (params.payload.type === OfferType.PRESALE) {
				if (!state.contractAddress?.IDO_PRESALE_FACTORY) {
					console.log("state.contractAddress");
					return;
				}
				const _idoFactoryContract = getPresaleFactoryContract(
					state.contractAddress.IDO_PRESALE_FACTORY[params.chainId]
				);
				const {
					TokenAddress,
					TokenRate,
					SoftCap,
					HardCap,
					MinBuyPerUser,
					MaxBuyPerUser,
					StartTime,
					EndTime,
					DexListingRate,
					LiquidityPC,
					Refund,
					AutoListing,
					UseWhiteList,
				} = params.payload.payload;

				const allocation = getTotalAmountOfApproveForPresale({
					tokenRate: TokenRate,
					hardCap: HardCap,
					liquidityPc: LiquidityPC,
					LiquidityRate: DexListingRate,
				});
				const idoDetails: CreateIDORequest = {
					TokenAddress: TokenAddress,
					TokenAllocation: toWei(allocation, params.decimals),
					TokenRate: toWei(TokenRate, params.decimals),
					SoftCap: toWei(SoftCap, params.decimals),
					HardCap: toWei(HardCap, params.decimals),
					MinBuyPerUser: toWei(MinBuyPerUser, params.decimals),
					MaxBuyPerUser: toWei(MaxBuyPerUser, params.decimals),
					StartTime: String(unixTimeStamp(StartTime)),
					EndTime: String(unixTimeStamp(EndTime)),
					DexListingRate: toWei(DexListingRate, params.decimals),
					LiquidityPC: LiquidityPC,
					Refund: Refund,
					AutoListing: AutoListing,
					UseWhiteList: UseWhiteList,
				};
				await _idoFactoryContract.methods
					.createIDO(idoDetails, params.pairCoin)
					.send(
						{ from: params.account, value: state.preFee },
						async function (error, transactionHash) {
							if (error) {
								dispatch({
									type: ActionType.STOPLOADING,
								});
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.CREATEIDO,
										hash: null,
										status: TRANSACTIONSTATUS.FAILED,
										result: {},
									},
								});
							} else {
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.CREATEIDO,
										hash: transactionHash,
										status: TRANSACTIONSTATUS.PENDING,
										result: {},
									},
								});
							}
						}
					)
					.on("receipt", function (receipt) {
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.CREATEIDO,
								hash: null,
								status: TRANSACTIONSTATUS.SUCCESS,
								result: receipt,
							},
						});
					})
					.on("error", function (err) {
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.CREATEIDO,
								hash: null,
								status: TRANSACTIONSTATUS.FAILED,
								result: {},
							},
						});
					});
			} else if (params.payload.type === OfferType.FAIRLAUNCH) {
				if (!state.contractAddress?.IDO_FAIRLAUNCH_FACTORY) {
					console.log("state.contractAddress");
					return;
				}
				const _idoFairlaunchFactoryContract =
					getFairLaunchFactoryContract(
						state.contractAddress.IDO_FAIRLAUNCH_FACTORY[
							params.chainId
						]
					);

				const {
					TokenAddress,
					TokenAllocation,
					SoftCap,
					BuyInLimit,
					BuyLimit,
					AutoListing,
					LiquidityPC,
					Refund,
					StartTime,
					EndTime,
				} = params.payload.payload;

				const allocation = getTotalAmountOfApproveForFairLaunch({
					liquidityPc: LiquidityPC,
					tokenForsale: TokenAllocation,
				});

				const idoDetails: FairlaunchRequest = {
					TokenAddress: TokenAddress,
					TokenAllocation: toWei(allocation, params.decimals),
					SoftCap: toWei(SoftCap, params.decimals),
					BuyInLimit: BuyInLimit,
					BuyLimit: BuyLimit,
					AutoListing: AutoListing,
					LiquidityPC: LiquidityPC,
					Refund: Refund,
					StartTime: String(unixTimeStamp(StartTime)),
					EndTime: String(unixTimeStamp(EndTime)),
				};

				await _idoFairlaunchFactoryContract.methods
					.createIDO(idoDetails, params.pairCoin)
					.send(
						{ from: params.account, value: state.preFee },
						async function (error, transactionHash) {
							if (error) {
								dispatch({
									type: ActionType.STOPLOADING,
								});
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.CREATEIDO,
										hash: null,
										status: TRANSACTIONSTATUS.FAILED,
										result: {},
									},
								});
							} else {
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.CREATEIDO,
										hash: transactionHash,
										status: TRANSACTIONSTATUS.PENDING,
										result: {},
									},
								});
							}
						}
					)
					.on("receipt", function (receipt) {
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.CREATEIDO,
								hash: null,
								status: TRANSACTIONSTATUS.SUCCESS,
								result: receipt,
							},
						});
					})
					.on("error", function (err) {
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.CREATEIDO,
								hash: null,
								status: TRANSACTIONSTATUS.FAILED,
								result: {},
							},
						});
					});
			}
		} catch (err: Error | any) {
			const parsedError = JSON.stringify(err.message);
			if (parsedError.includes("reverted with reason ")) {
				console.log("revertedError(err)", revertedError(err));
			}
			console.log("err.message", err.message);
		} finally {
			dispatch({
				type: ActionType.STOPLOADING,
			});
		}
	};

	const buyToken = async (payload: BuyToken) => {
		try {
			dispatch({ type: ActionType.STARTLOADING });
			let _contract;
			if (payload.type === OfferType.PRESALE) {
				_contract = getPresaleContract(payload.idoAddress);
			} else {
				_contract = getFairlaunchContract(payload.idoAddress);
			}

			if (payload.tokenType === "stable") {
				const _erc20Contract = getErc20Contract(payload.tokenAddress);
				const decimal = await _erc20Contract.methods.decimals().call();

				await _contract.methods
					.buyTokens(toWei(payload.amount, Number(decimal)))
					.send(
						{ from: payload.account },
						function (error, transactionHash) {
							if (error) {
								dispatch({
									type: ActionType.STOPLOADING,
								});
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.BUYTOKEN,
										hash: null,
										status: TRANSACTIONSTATUS.FAILED,
										result: {},
									},
								});
							} else {
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.BUYTOKEN,
										hash: transactionHash,
										status: TRANSACTIONSTATUS.PENDING,
										result: {},
									},
								});
							}
						}
					)
					.on("receipt", async function (receipt) {
						console.log("receipt", receipt);
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.BUYTOKEN,
								hash: null,
								status: TRANSACTIONSTATUS.SUCCESS,
								result: receipt,
							},
						});
					})
					.on("error", async function (error) {
						console.log("error", error);
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.BUYTOKEN,
								hash: null,
								status: TRANSACTIONSTATUS.FAILED,
								result: null,
							},
						});
					});
			} else if (payload.tokenType === "native") {
				await _contract.methods
					.buyTokensWithNative()
					.send(
						{ from: payload.account },
						function (error, transactionHash) {
							if (error) {
								dispatch({
									type: ActionType.STOPLOADING,
								});
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.BUYTOKEN,
										hash: null,
										status: TRANSACTIONSTATUS.FAILED,
										result: {},
									},
								});
							} else {
								dispatch({
									type: ActionType.SETTRANSACTION,
									payload: {
										type: TRANSACTIONTYPE.BUYTOKEN,
										hash: transactionHash,
										status: TRANSACTIONSTATUS.PENDING,
										result: {},
									},
								});
							}
						}
					)
					.on("receipt", async function (receipt) {
						console.log("receipt", receipt);
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.BUYTOKEN,
								hash: null,
								status: TRANSACTIONSTATUS.SUCCESS,
								result: receipt,
							},
						});
					})
					.on("error", async function (error) {
						console.log("error", error);
						dispatch({
							type: ActionType.SETTRANSACTION,
							payload: {
								type: TRANSACTIONTYPE.BUYTOKEN,
								hash: null,
								status: TRANSACTIONSTATUS.FAILED,
								result: null,
							},
						});
					});
			}
		} catch (err: any) {
			const parsedError = JSON.stringify(err.message);
			if (parsedError.includes("reverted with reason ")) {
				console.log("revertedError(err)", revertedError(err));
			}
			console.log("err.message", err.message);
		}
	};

	interface ProviderValue extends IIDoState {
		setContractAddress(payload: ContractAddresses): void;
		createIdo(payload: CreateIdoPayload): Promise<void>;
		getIdoDetails(payload: IdoDetailsParams): Promise<void>;
		checkAllowance(payload: AllowanceParams): Promise<void>;
		approveToken(
			payload: AllowanceParams & {
				amount: string;
			}
		): Promise<void>;
		buyToken(payload: BuyToken): Promise<void>;
	}

	const values: ProviderValue = {
		...initialState,
		setContractAddress,
		createIdo,
		getIdoDetails,
		checkAllowance,
		approveToken,
		buyToken,
	};

	return <IdoContext.Provider value={values}>{children}</IdoContext.Provider>;
};

export const useIdoHook = () => {
	return useContext<IIDoState>(IdoContext);
};
