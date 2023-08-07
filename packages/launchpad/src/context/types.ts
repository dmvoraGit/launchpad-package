import {
	IdopoolinfoResponse,
	UserRecordResponse as PresaleUserRecord,
} from "../contract-types/IdoPresale";
import {
	FairlaunchinfoResponse,
	UserRecordResponse as FairLaunchUserRecord,
} from "../contract-types/FairLaunch";

import { CreateIDORequest as PresaleRequest } from "../contract-types/IdoPreSaleFactory";
import { CreateIDORequest as FairLaunchRequets } from "../contract-types/FairLaunchFactory";

export enum OfferType {
	PRESALE = "PreSale",
	FAIRLAUNCH = "FairLaunch",
}

export interface ContractAddresses {
	IDO_PRESALE_FACTORY?: {
		[key: number | string]: string;
	};
	IDO_FAIRLAUNCH_FACTORY?: {
		[key: number | string]: string;
	};
}

export type PoolInfoType = {
	valueRaised: string;
	totalTokenSold?: string;
	userInfo: FairLaunchUserRecord | PresaleUserRecord;
	pool: IdopoolinfoResponse | FairlaunchinfoResponse;
};

export type IdoDetailsParams = {
	idoAddress: string;
	account: string;
	idoType: OfferType;
};

export type AllowanceParams = {
	tokenAddress: string;
	ownwer: string;
	spender: string;
};

export type BuyToken = {
	type: OfferType;
	idoAddress: string;
	tokenAddress: string;
	chainId: number;
	account: string;
	amount: string | number;
	tokenType: "stable" | "native";
};

export type IdoPAyload =
	| {
			type: OfferType.PRESALE;
			payload: PresaleRequest;
	  }
	| {
			type: OfferType.FAIRLAUNCH;
			payload: FairLaunchRequets;
	  };

export type CreateIdoPayload = {
	chainId: number;
	account: string;
	decimals: number;
	payload: IdoPAyload;
	pairCoin: string;
};
