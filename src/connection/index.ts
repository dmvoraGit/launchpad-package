import { Web3ReactHooks, initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";

export enum ConnectionType {
	INJECTED = "INJECTED",
	WALLET_CONNECT = "WALLET_CONNECT",
}

export const CONNECTOR_TYPE = {
	injected: "injected",
	walletConnect: "walletConnect",
};

export interface Connection {
	connector: Connector;
	hooks: Web3ReactHooks;
	type: ConnectionType;
}

function onError(error: Error) {
	console.debug(`web3-react error: ${error}`);
}

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
	(actions) => new MetaMask({ actions, onError })
);

export const injectedConnection: Connection = {
	connector: web3Injected,
	hooks: web3InjectedHooks,
	type: ConnectionType.INJECTED,
};

export const AUTHENTICATION_STATE = {
	NOT_STARTED: "NOT_STARTED",
	CONNECTING_WALLET: "CONNECTING_WALLET",
	WALLET_CONNECTED: "WALLET_CONNECTED",
	WALLET_CONNECTION_FAILED: "WALLET_CONNECTION_FAILED",
	NETWORK_SWITCH_REQUEST: "NETWORK_SWITCH_REQUEST",
	NETWORK_SWITCH_FAILED: "NETWORK_SWITCH_FAILED",
};

export const connectors: [Connector, Web3ReactHooks][] = [
	injectedConnection,
].map(({ hooks, connector }) => [connector, hooks]);
