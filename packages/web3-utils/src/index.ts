declare global {
	interface Window {
		web3: any;
		ethereum: any;
	}
}

import BigNumber from "bignumber.js";
import Web3 from "web3";
import ERC20ABI from "./abi/ERC20.json";
import { ContractContext } from "./contract-types/ERC20";
import { AbiItem } from "web3-utils";

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

export const isMetaMaskInstalled = () => {
	return typeof window.web3 !== "undefined";
};

export const toWei = (amount: string | number, decimals = 18) => {
	try {
		if (!amount) {
			return new BigNumber(0).toString();
		}
		return new BigNumber(amount)
			.multipliedBy(new BigNumber(10).exponentiatedBy(decimals))
			.toFixed(0)
			.toString();
	} catch (error) {
		console.log("exeption in toWei , ", error);
		return "0";
	}
};

export const fromWei = (amount: string | number, decimals = 18) => {
	try {
		if (!amount) {
			return new BigNumber(0).toString();
		}

		return new BigNumber(amount)
			.div(new BigNumber(10).exponentiatedBy(decimals))
			.toString();
	} catch (error) {
		console.log("exeption in fromWei ", error);
		return null;
	}
};

export const calCulateOutputTokenAmount = (
	amount: string | number,
	tokenrate: string | number,
	decimals = 18
) => {
	try {
		if (!amount || !tokenrate) {
			return new BigNumber(0).toString();
		}
		return new BigNumber(amount)
			.multipliedBy(new BigNumber(10).exponentiatedBy(decimals))
			.multipliedBy(tokenrate)
			.toString();
	} catch (error) {
		console.log("exeption in toWei , ", error);
		return null;
	}
};

export const revertedError = (error: Error | any, index = 1) => {
	console.log("error.message", error.message);

	const parsedError = JSON.stringify(error.message);
	console.log("parsedError", parsedError);
	const msg = parsedError?.split(`'`);
	let message: any = [];
	msg?.map((err) => {
		if (!err.includes("\\") && !err.includes('"\\') && !err.includes("[")) {
			!err?.startsWith("\\") && message.push(err);
		}
	});
	console.log("msg", message);
	return message[0];
};

export const tokenInfo = async ({ address }: { address: string }) => {
	try {
		const web3 = new Web3(window.ethereum);
		const _erc20Contract = new web3.eth.Contract(
			ERC20ABI as AbiItem[],
			address
		) as unknown as ContractContext;

		const result = await Promise.all([
			_erc20Contract.methods.name().call(),
			_erc20Contract.methods.symbol().call(),
			_erc20Contract.methods.decimals().call(),
			_erc20Contract.methods.totalSupply().call(),
		]);

		return result;
	} catch (err: Error | any) {
		console.log("err", err);
		const parsedError = JSON.stringify(err.message);
		if (parsedError.includes("reverted with reason ")) {
			console.log("(revertedError(err))", revertedError(err));

			return revertedError(err);
		}
		return err?.message;
	}
};

export const checkEnoughTokens = (
	tokens: number | string,
	hardCap: number | string,
	tokenrate: number | string,
	decimals = 18
) => {
	try {
		if (!tokens || !hardCap || !tokenrate) {
			return false;
		}

		const allocation = new BigNumber(tokens).multipliedBy(
			new BigNumber(10).exponentiatedBy(decimals)
		);
		const hardcap = new BigNumber(hardCap);
		const rate = new BigNumber(tokenrate);

		return hardcap
			.multipliedBy(rate)
			.multipliedBy(new BigNumber(10).exponentiatedBy(decimals))
			.lte(allocation);
	} catch (error) {
		console.log("exeption in fromWei ", error);
		return null;
	}
};

export const tokenAmount = (
	hardCap: string | number,
	tokenrate: string | number,
	decimals = 18
) => {
	try {
		if (!hardCap || !tokenrate) {
			return false;
		}

		const hardcap = new BigNumber(hardCap);
		const rate = new BigNumber(tokenrate);
		return hardcap
			.multipliedBy(rate)
			.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));
	} catch (error) {
		console.log("exeption in fromWei ", error);
		return null;
	}
};

export const getNativeBalance = async (address: string) => {
	let web3 = new Web3(window.ethereum);
	return web3.eth.getBalance(address);
};

function convertToInternationalCurrencySystem(
	labelValue: number,
	formatter: any
): any {
	// Nine Zeroes for Billions
	return Math.abs(Number(labelValue)) >= 1.0e9
		? formatter
				.format((Math.abs(Number(labelValue)) / 1.0e9).toFixed(2))
				.slice(1) + "B"
		: // Six Zeroes for Millions
		Math.abs(Number(labelValue)) >= 1.0e6
		? formatter
				.format((Math.abs(Number(labelValue)) / 1.0e6).toFixed(2))
				.slice(1) + "M"
		: // Three Zeroes for Thousands
		Math.abs(Number(labelValue)) >= 1.0e3
		? formatter
				.format((Math.abs(Number(labelValue)) / 1.0e3).toFixed(2))
				.slice(1) + "K"
		: formatter.format(Math.abs(Number(labelValue))).slice(1);
}

export const formatLargeNumber = (value: number, precision = 2) => {
	const _value = !value ? 0 : value;
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: precision,
	});

	const formattedValue = convertToInternationalCurrencySystem(
		_value,
		formatter
	);

	return formattedValue;
};

export const resetCurrencyFormatting = (value: string) => {
	return value.split(",").join("");
};

export const isNumber = (value: any) => {
	return !isNaN(parseInt(value));
};

export const formatCurrency = (
	value: number,
	usd = false,
	fractionDigits = 1,
	currencyFormat = false
) => {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: fractionDigits,
	});

	//for currency format with $symbol
	if (usd) {
		return formatter.format(value ? value : 0);
	}

	if (typeof window.web3 === "undefined") {
		return formatter.format(value ? value : 0).slice(1);
	}
	const netId = window.ethereum.networkVersion;
	if (["97", "56"].includes(netId) && !currencyFormat) {
		// for bsc network only
		return convertToInternationalCurrencySystem(
			value ? value : 0,
			formatter
		);
	}
	return formatter.format(value ? value : 0).slice(1);
};

export const unixTimeStamp = (date: any) => {
	return Math.floor(new Date(date).getTime() / 1000);
};

//for presale
export const getTotalAmountOfApproveForPresale = ({
	tokenRate,
	hardCap,
	liquidityPc,
	LiquidityRate,
}: {
	tokenRate: string | number;
	hardCap: string | number;
	liquidityPc: string | number;
	LiquidityRate: string | number;
}) => {
	return BigNumber(tokenRate)
		.times(hardCap)
		.plus(
			BigNumber(hardCap).times(liquidityPc).div(100).times(LiquidityRate)
		)
		.toString();
};

//for presale
export const getTotalAmountOfApproveForFairLaunch = ({
	tokenForsale,
	liquidityPc,
}: {
	tokenForsale: string | number;
	liquidityPc: string | number;
}) => {
	return Number(liquidityPc) === 0
		? BigNumber(tokenForsale)
				.times(liquidityPc)
				.div(100)
				.plus(tokenForsale)
				.toString()
		: BigNumber(tokenForsale).toString();
};
