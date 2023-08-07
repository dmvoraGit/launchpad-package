import { ContractAddresses, OfferType, PoolInfoType } from "./types";

//enums
export enum ActionType {
	SETADDRESS = "SETADDRESS",
	STARTLOADING = "STARTLOADING",
	STOPLOADING = "STOPLOADING",
	SETTRANSACTION = "SETTRANSACTION",
	SETPOOL = "SETPOOL",
	SETIDODETAILS = "SETIDODETAILS",
	SETALLOWANCE = "CHECKALLOWANCE",
}

export type Action =
	| {
			type: ActionType.SETADDRESS;
			payload: ContractAddresses;
	  }
	| {
			type: ActionType.STARTLOADING;
	  }
	| {
			type: ActionType.STOPLOADING;
	  }
	| {
			type: ActionType.SETTRANSACTION;
			payload: {
				type: null | string; // swap/ add_liquidity, remove_liquidity
				hash: null | string;
				status: null | string; // pending, success, failed
				result: any;
			};
	  }
	| {
			type: ActionType.SETPOOL;
			payload: PoolInfoType;
	  }
	| {
			type: ActionType.SETALLOWANCE;
			payload: string;
	  };
