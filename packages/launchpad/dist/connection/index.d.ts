import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
export declare enum ConnectionType {
    INJECTED = "INJECTED",
    WALLET_CONNECT = "WALLET_CONNECT"
}
export declare const CONNECTOR_TYPE: {
    injected: string;
    walletConnect: string;
};
export interface Connection {
    connector: Connector;
    hooks: Web3ReactHooks;
    type: ConnectionType;
}
export declare const injectedConnection: Connection;
export declare const AUTHENTICATION_STATE: {
    NOT_STARTED: string;
    CONNECTING_WALLET: string;
    WALLET_CONNECTED: string;
    WALLET_CONNECTION_FAILED: string;
    NETWORK_SWITCH_REQUEST: string;
    NETWORK_SWITCH_FAILED: string;
};
export declare const connectors: [Connector, Web3ReactHooks][];
