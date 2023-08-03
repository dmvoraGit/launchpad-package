import { useWeb3React } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import React, {
	FC,
	ReactNode,
	createContext,
	useCallback,
	useContext,
} from "react";
import { injectedConnection } from "../connection";

interface IWallateState {
	isActivating: boolean;
	isActive: boolean;
	chainId: number | undefined;
	account: string | undefined;
	connectWallate(): void;
}

interface IWallateProviderProps {
	children: ReactNode;
}

const WallateContext = createContext<IWallateState>({
	isActivating: false,
	isActive: false,
	chainId: undefined,
	account: undefined,
	connectWallate: () => {},
});

export const WallateProvider: FC<IWallateProviderProps> = ({ children }) => {
	const { chainId, account, isActive, isActivating, connector } =
		useWeb3React();

	const connectWallate = useCallback(
		async (connector: Connector = injectedConnection.connector) => {
			try {
				await connector.activate();
			} catch (err) {
				console.log("err", err);
			}
		},
		[connector, isActive]
	);

	const deactivateWallate = useCallback(async () => {
		try {
			if (connector?.deactivate) {
				await connector.deactivate();
			} else {
				await connector.resetState();
			}
		} catch (err) {
			console.log("err", err);
		}
		if (!connector) {
			return;
		}
	}, [connector]);

	return (
		<WallateContext.Provider
			value={{
				connectWallate,
				isActivating,
				isActive,
				chainId,
				account,
			}}
		>
			{children}
		</WallateContext.Provider>
	);
};

export const useWallate = () => {
	return useContext<IWallateState>(WallateContext);
};
