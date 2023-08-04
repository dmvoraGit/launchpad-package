"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectors = exports.AUTHENTICATION_STATE = exports.injectedConnection = exports.CONNECTOR_TYPE = exports.ConnectionType = void 0;
const core_1 = require("@web3-react/core");
const metamask_1 = require("@web3-react/metamask");
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["INJECTED"] = "INJECTED";
    ConnectionType["WALLET_CONNECT"] = "WALLET_CONNECT";
})(ConnectionType || (exports.ConnectionType = ConnectionType = {}));
exports.CONNECTOR_TYPE = {
    injected: "injected",
    walletConnect: "walletConnect",
};
function onError(error) {
    console.debug(`web3-react error: ${error}`);
}
const [web3Injected, web3InjectedHooks] = (0, core_1.initializeConnector)((actions) => new metamask_1.MetaMask({ actions, onError }));
exports.injectedConnection = {
    connector: web3Injected,
    hooks: web3InjectedHooks,
    type: ConnectionType.INJECTED,
};
exports.AUTHENTICATION_STATE = {
    NOT_STARTED: "NOT_STARTED",
    CONNECTING_WALLET: "CONNECTING_WALLET",
    WALLET_CONNECTED: "WALLET_CONNECTED",
    WALLET_CONNECTION_FAILED: "WALLET_CONNECTION_FAILED",
    NETWORK_SWITCH_REQUEST: "NETWORK_SWITCH_REQUEST",
    NETWORK_SWITCH_FAILED: "NETWORK_SWITCH_FAILED",
};
exports.connectors = [
    exports.injectedConnection,
].map(({ hooks, connector }) => [connector, hooks]);
