import { useState } from "react";
import { getErc20Contract } from "../contract";

export const useAllowance = ({
	tokenAddress,
	ownwer,
	spender,
}: {
	tokenAddress: string;
	ownwer: string;
	spender: string;
}) => {
	const [allowance, setAllowance] = useState<string>("0");

	const checkAllowance = async () => {
		try {
			const _contract = getErc20Contract(tokenAddress);
			const result = await _contract.methods
				.allowance(ownwer, spender)
				.call();
			setAllowance(result?.toString() || "0");
		} catch (err) {
			console.log("err", err);
		}
	};

	const approve = async () => {};
};
