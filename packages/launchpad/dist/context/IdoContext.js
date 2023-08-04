"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIdoHook = exports.IdoProvider = exports.TRANSACTIONTYPE = exports.TRANSACTIONSTATUS = void 0;
const react_1 = __importStar(require("react"));
const actions_types_1 = require("./actions-types");
const contract_1 = require("../contract");
const web3_utils_1 = require("@logisticinfotechs/web3-utils");
var TRANSACTIONSTATUS;
(function (TRANSACTIONSTATUS) {
    TRANSACTIONSTATUS["PENDING"] = "PENDING";
    TRANSACTIONSTATUS["FAILED"] = "FAILED";
    TRANSACTIONSTATUS["SUCCESS"] = "SUCCESS";
})(TRANSACTIONSTATUS || (exports.TRANSACTIONSTATUS = TRANSACTIONSTATUS = {}));
var TRANSACTIONTYPE;
(function (TRANSACTIONTYPE) {
    TRANSACTIONTYPE["CREATEIDO"] = "CREATEIDO";
    TRANSACTIONTYPE["APPROVE"] = "APPROVE";
})(TRANSACTIONTYPE || (exports.TRANSACTIONTYPE = TRANSACTIONTYPE = {}));
const IdoContext = (0, react_1.createContext)({});
const IdoProvider = ({ children }) => {
    const initialState = {
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
    const reducer = (state, action) => {
        switch (action.type) {
            case actions_types_1.ActionType.SETADDRESS:
                return Object.assign(Object.assign({}, state), { contractAddress: Object.assign(Object.assign({}, state.contractAddress), action.payload) });
            case actions_types_1.ActionType.STARTLOADING: {
                return Object.assign(Object.assign({}, state), { loading: true });
            }
            case actions_types_1.ActionType.STOPLOADING: {
                return Object.assign(Object.assign({}, state), { loading: false });
            }
            case actions_types_1.ActionType.SETTRANSACTION: {
                return Object.assign(Object.assign({}, state), { transaction: Object.assign(Object.assign({}, state.transaction), action.payload) });
            }
            case actions_types_1.ActionType.SETPOOL: {
                return Object.assign(Object.assign({}, state), { poolInfo: Object.assign(Object.assign({}, state.poolInfo), action.payload) });
            }
            case actions_types_1.ActionType.SETIDODETAILS: {
                return Object.assign(Object.assign({}, state), action.payload);
            }
            default:
                return Object.assign({}, state);
        }
    };
    const [state, dispatch] = (0, react_1.useReducer)(reducer, initialState);
    const setContractAddress = (payload) => {
        dispatch({
            type: actions_types_1.ActionType.SETADDRESS,
            payload,
        });
    };
    const setIdoDetails = ({ idoAddress, idoType, account, }) => {
        dispatch({
            type: actions_types_1.ActionType.SETIDODETAILS,
            payload: {
                idoAddress,
                idoType,
                account,
            },
        });
    };
    const getIdoDetails = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            dispatch({
                type: actions_types_1.ActionType.STARTLOADING,
            });
            if (!state.idoAddress || !state.account || !state.idoType)
                return;
            let _idoContract;
            let totalTokenSold;
            if (state.idoType === actions_types_1.OfferType.PRESALE) {
                _idoContract = (0, contract_1.getPresaleContract)(state.idoAddress);
                totalTokenSold = yield _idoContract.methods
                    .totalTokenSold()
                    .call();
            }
            else {
                _idoContract = (0, contract_1.getFairlaunchContract)(state.idoAddress);
            }
            const [totalRaised, pool, userInfo] = yield Promise.all([
                _idoContract.methods.valueRaised().call(),
                _idoContract.methods.getIdoDetails().call(),
                _idoContract.methods.userRecord(state.account).call(),
            ]);
            dispatch({
                type: actions_types_1.ActionType.SETPOOL,
                payload: {
                    totalRaised,
                    totalTokenSold,
                    pool: Object.assign({}, pool),
                    userInfo,
                },
            });
        }
        catch (err) {
            console.log("err", err);
        }
        finally {
            dispatch({
                type: actions_types_1.ActionType.STOPLOADING,
            });
        }
    });
    //create ido
    const createIdo = (params) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            dispatch({ type: actions_types_1.ActionType.STARTLOADING });
            if (params.payload.type === actions_types_1.OfferType.PRESALE) {
                if (!((_a = state.contractAddress) === null || _a === void 0 ? void 0 : _a.IDO_PRESALE_FACTORY)) {
                    console.log("state.contractAddress");
                    return;
                }
                const _idoFactoryContract = (0, contract_1.getPresaleFactoryContract)(state.contractAddress.IDO_PRESALE_FACTORY[params.chainId]);
                const { TokenAddress, TokenRate, SoftCap, HardCap, MinBuyPerUser, MaxBuyPerUser, StartTime, EndTime, DexListingRate, LiquidityPC, Refund, AutoListing, UseWhiteList, } = params.payload.payload;
                const allocation = (0, web3_utils_1.getTotalAmountOfApproveForPresale)({
                    tokenRate: TokenRate,
                    hardCap: HardCap,
                    liquidityPc: LiquidityPC,
                    LiquidityRate: DexListingRate,
                });
                const idoDetails = {
                    TokenAddress: TokenAddress,
                    TokenAllocation: (0, web3_utils_1.toWei)(allocation, params.decimals),
                    TokenRate: (0, web3_utils_1.toWei)(TokenRate, params.decimals),
                    SoftCap: (0, web3_utils_1.toWei)(SoftCap, params.decimals),
                    HardCap: (0, web3_utils_1.toWei)(HardCap, params.decimals),
                    MinBuyPerUser: (0, web3_utils_1.toWei)(MinBuyPerUser, params.decimals),
                    MaxBuyPerUser: (0, web3_utils_1.toWei)(MaxBuyPerUser, params.decimals),
                    StartTime: String((0, web3_utils_1.unixTimeStamp)(StartTime)),
                    EndTime: String((0, web3_utils_1.unixTimeStamp)(EndTime)),
                    DexListingRate: (0, web3_utils_1.toWei)(DexListingRate, params.decimals),
                    LiquidityPC: LiquidityPC,
                    Refund: Refund,
                    AutoListing: AutoListing,
                    UseWhiteList: UseWhiteList,
                };
                yield _idoFactoryContract.methods
                    .createIDO(idoDetails, params.pairCoin)
                    .send({ from: params.account, value: state.preFee }, function (error, transactionHash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            dispatch({
                                type: actions_types_1.ActionType.STOPLOADING,
                            });
                            dispatch({
                                type: actions_types_1.ActionType.SETTRANSACTION,
                                payload: {
                                    type: TRANSACTIONTYPE.CREATEIDO,
                                    hash: null,
                                    status: TRANSACTIONSTATUS.FAILED,
                                    result: {},
                                },
                            });
                        }
                        else {
                            dispatch({
                                type: actions_types_1.ActionType.SETTRANSACTION,
                                payload: {
                                    type: TRANSACTIONTYPE.CREATEIDO,
                                    hash: transactionHash,
                                    status: TRANSACTIONSTATUS.PENDING,
                                    result: {},
                                },
                            });
                        }
                    });
                })
                    .on("receipt", function (receipt) {
                    dispatch({
                        type: actions_types_1.ActionType.SETTRANSACTION,
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
                        type: actions_types_1.ActionType.SETTRANSACTION,
                        payload: {
                            type: TRANSACTIONTYPE.CREATEIDO,
                            hash: null,
                            status: TRANSACTIONSTATUS.FAILED,
                            result: {},
                        },
                    });
                });
            }
            else if (params.payload.type === actions_types_1.OfferType.FAIRLAUNCH) {
                if (!((_b = state.contractAddress) === null || _b === void 0 ? void 0 : _b.IDO_FAIRLAUNCH_FACTORY)) {
                    console.log("state.contractAddress");
                    return;
                }
                const _idoFairlaunchFactoryContract = (0, contract_1.getFairLaunchFactoryContract)(state.contractAddress.IDO_FAIRLAUNCH_FACTORY[params.chainId]);
                const { TokenAddress, TokenAllocation, SoftCap, BuyInLimit, BuyLimit, AutoListing, LiquidityPC, Refund, StartTime, EndTime, } = params.payload.payload;
                const allocation = (0, web3_utils_1.getTotalAmountOfApproveForFairLaunch)({
                    liquidityPc: LiquidityPC,
                    tokenForsale: TokenAllocation,
                });
                const idoDetails = {
                    TokenAddress: TokenAddress,
                    TokenAllocation: (0, web3_utils_1.toWei)(allocation, params.decimals),
                    SoftCap: (0, web3_utils_1.toWei)(SoftCap, params.decimals),
                    BuyInLimit: BuyInLimit,
                    BuyLimit: BuyLimit,
                    AutoListing: AutoListing,
                    LiquidityPC: LiquidityPC,
                    Refund: Refund,
                    StartTime: String((0, web3_utils_1.unixTimeStamp)(StartTime)),
                    EndTime: String((0, web3_utils_1.unixTimeStamp)(EndTime)),
                };
                yield _idoFairlaunchFactoryContract.methods
                    .createIDO(idoDetails, params.pairCoin)
                    .send({ from: params.account, value: state.preFee }, function (error, transactionHash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            dispatch({
                                type: actions_types_1.ActionType.STOPLOADING,
                            });
                            dispatch({
                                type: actions_types_1.ActionType.SETTRANSACTION,
                                payload: {
                                    type: TRANSACTIONTYPE.CREATEIDO,
                                    hash: null,
                                    status: TRANSACTIONSTATUS.FAILED,
                                    result: {},
                                },
                            });
                        }
                        else {
                            dispatch({
                                type: actions_types_1.ActionType.SETTRANSACTION,
                                payload: {
                                    type: TRANSACTIONTYPE.CREATEIDO,
                                    hash: transactionHash,
                                    status: TRANSACTIONSTATUS.PENDING,
                                    result: {},
                                },
                            });
                        }
                    });
                })
                    .on("receipt", function (receipt) {
                    dispatch({
                        type: actions_types_1.ActionType.SETTRANSACTION,
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
                        type: actions_types_1.ActionType.SETTRANSACTION,
                        payload: {
                            type: TRANSACTIONTYPE.CREATEIDO,
                            hash: null,
                            status: TRANSACTIONSTATUS.FAILED,
                            result: {},
                        },
                    });
                });
            }
        }
        catch (err) {
            const parsedError = JSON.stringify(err.message);
            if (parsedError.includes("reverted with reason ")) {
                console.log("revertedError(err)", (0, web3_utils_1.revertedError)(err));
            }
            console.log("err.message", err.message);
        }
        finally {
            dispatch({
                type: actions_types_1.ActionType.STOPLOADING,
            });
        }
    });
    (0, react_1.useEffect)(() => {
        getIdoDetails();
    }, [state.account, state.idoAddress, state.idoType]);
    return (react_1.default.createElement(IdoContext.Provider, { value: Object.assign(Object.assign({}, initialState), { setContractAddress,
            createIdo,
            getIdoDetails,
            setIdoDetails }) }, children));
};
exports.IdoProvider = IdoProvider;
const useIdoHook = () => {
    return (0, react_1.useContext)(IdoContext);
};
exports.useIdoHook = useIdoHook;
