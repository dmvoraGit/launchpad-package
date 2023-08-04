import { FC, ReactNode } from "react";
import { ContractAddresses } from "./actions-types";
interface IIDoState {
    loading?: boolean;
    transaction?: {
        type: null | string;
        hash: null | string;
        status: null | string;
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
export declare enum TRANSACTIONSTATUS {
    PENDING = "PENDING",
    FAILED = "FAILED",
    SUCCESS = "SUCCESS"
}
export declare enum TRANSACTIONTYPE {
    CREATEIDO = "CREATEIDO",
    APPROVE = "APPROVE"
}
export declare const IdoProvider: FC<{
    children: ReactNode;
}>;
export declare const useIdoHook: () => IIDoState;
export {};
