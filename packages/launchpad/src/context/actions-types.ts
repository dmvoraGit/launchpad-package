//enums
export enum ActionType {
	SETADDRESS = "SETADDRESS",
	STARTLOADING = "STARTLOADING",
	STOPLOADING = "STOPLOADING",
	SETTRANSACTION = "SETTRANSACTION",
	SETPOOL = "SETPOOL",
	SETIDODETAILS = "SETIDODETAILS",
}

export enum OfferType {
	PRESALE = "PreSale",
	FAIRLAUNCH = "FairLaunch",
}

//types
export type SorN = string | number;

export type IdoPAyload =
	| {
			type: OfferType.PRESALE;
			payload: {
				TokenAddress: string;
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
			};
	  }
	| {
			type: OfferType.FAIRLAUNCH;
			payload: {
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
			};
	  };

export type CreateIdoPayload = {
	chainId: SorN;
	account: string;
	decimals: number;
	payload: IdoPAyload;
	pairCoin: string;
};

//interfaces
export interface ContractAddresses {
	IDO_PRESALE_FACTORY?: {
		[key: number | string]: string;
	};
	IDO_FAIRLAUNCH_FACTORY?: {
		[key: number | string]: string;
	};
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
			payload: any;
	  }
	| {
			type: ActionType.SETIDODETAILS;
			payload: {
				idoAddress?: string;
				idoType?: string;
				account?: string;
			};
	  };
