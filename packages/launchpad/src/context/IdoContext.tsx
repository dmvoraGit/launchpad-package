import React, {
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from "react";
import {
	Action,
	ActionType,
	ContractAddresses,
	CreateIdoPayload,
	OfferType,
} from "./actions-types";
import {
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

interface IIDoState {
	loading?: boolean;
	transaction?: {
		type: null | string; // swap/ add_liquidity, remove_liquidity
		hash: null | string;
		status: null | string; // pending, success, failed
		result: any;
	};
	error?: null | string;
	postFee?: any;
	preFee?: any;
	contractAddress?: ContractAddresses | null;
	poolInfo?: any;
	idoAddress?: string | null;
	idoType?: string | null;
	account?: string;
}

export enum TRANSACTIONSTATUS {
	PENDING = "PENDING",
	FAILED = "FAILED",
	SUCCESS = "SUCCESS",
}

export enum TRANSACTIONTYPE {
	CREATEIDO = "CREATEIDO",
	APPROVE = "APPROVE",
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
		preFee: null,
		contractAddress: null,
		poolInfo: {},
		idoAddress: null,
		idoType: null,
		account: "",
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
			case ActionType.SETIDODETAILS: {
				return {
					...state,
					...action.payload,
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

	const setIdoDetails = ({
		idoAddress,
		idoType,
		account,
	}: {
		idoAddress?: string;
		idoType?: string;
		account?: string;
	}) => {
		dispatch({
			type: ActionType.SETIDODETAILS,
			payload: {
				idoAddress,
				idoType,
				account,
			},
		});
	};

	const getIdoDetails = async () => {
		try {
			dispatch({
				type: ActionType.STARTLOADING,
			});
			if (!state.idoAddress || !state.account || !state.idoType) return;
			let _idoContract;
			let totalTokenSold;
			if (state.idoType === OfferType.PRESALE) {
				_idoContract = getPresaleContract(state.idoAddress);
				totalTokenSold = await _idoContract.methods
					.totalTokenSold()
					.call();
			} else {
				_idoContract = getFairlaunchContract(state.idoAddress);
			}
			const [totalRaised, pool, userInfo] = await Promise.all([
				_idoContract.methods.valueRaised().call(),
				_idoContract.methods.getIdoDetails().call(),
				_idoContract.methods.userRecord(state.account).call(),
			]);

			dispatch({
				type: ActionType.SETPOOL,
				payload: {
					totalRaised,
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

	useEffect(() => {
		getIdoDetails();
	}, [state.account, state.idoAddress, state.idoType]);

	return (
		<IdoContext.Provider
			value={{
				...initialState,
				setContractAddress,
				createIdo,
				getIdoDetails,
				setIdoDetails,
			}}
		>
			{children}
		</IdoContext.Provider>
	);
};

export const useIdoHook = () => {
	return useContext<IIDoState>(IdoContext);
};
