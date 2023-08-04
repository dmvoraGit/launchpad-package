import Web3 from "web3";
import ERC20ABI from "../abi/ERC20.json";
import PRESALEFACTORYABI from "../abi/IdoPreSaleFactory.json";
import FAIRLAUNCHFACTORYABI from "../abi/FairLaunchFactory.json";
import PRESALEABI from "../abi/IdoPresale.json";
import FAIRLAUNCHABI from "../abi/FairLaunch.json";

import { ContractContext as ERC20Context } from "../contract-types/ERC20";
import { ContractContext as PRESALEFACORYContext } from "../contract-types/IdoPreSaleFactory";
import { ContractContext as FAIRLAUNCHFACTORYContext } from "../contract-types/FairLaunchFactory";
import { ContractContext as PRESALEContext } from "../contract-types/IdoPresale";
import { ContractContext as FAIRLAUNCHContext } from "../contract-types/FairLaunch";

interface ContractParams {
	abi: any;
	address: string;
}

const getContract = ({ abi, address }: ContractParams) => {
	if (!address) return;
	const web3 = new Web3(window?.ethereum as any);
	return new web3.eth.Contract(abi as any, address);
};

export const getErc20Contract = (address: string) => {
	return getContract({ abi: ERC20ABI, address }) as unknown as ERC20Context;
};

export const getPresaleFactoryContract = (address: string) => {
	return getContract({
		abi: PRESALEFACTORYABI,
		address: address,
	}) as unknown as PRESALEFACORYContext;
};

export const getFairLaunchFactoryContract = (address: string) => {
	return getContract({
		abi: FAIRLAUNCHFACTORYABI,
		address,
	}) as unknown as FAIRLAUNCHFACTORYContext;
};

export const getPresaleContract = (address: string) => {
	return getContract({
		abi: PRESALEABI,
		address,
	}) as unknown as PRESALEContext;
};

export const getFairlaunchContract = (address: string) => {
	return getContract({
		abi: FAIRLAUNCHABI,
		address,
	}) as unknown as FAIRLAUNCHContext;
};
