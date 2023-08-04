"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFairlaunchContract = exports.getPresaleContract = exports.getFairLaunchFactoryContract = exports.getPresaleFactoryContract = exports.getErc20Contract = void 0;
const web3_1 = __importDefault(require("web3"));
const ERC20_json_1 = __importDefault(require("../abi/ERC20.json"));
const IdoPreSaleFactory_json_1 = __importDefault(require("../abi/IdoPreSaleFactory.json"));
const FairLaunchFactory_json_1 = __importDefault(require("../abi/FairLaunchFactory.json"));
const IdoPresale_json_1 = __importDefault(require("../abi/IdoPresale.json"));
const FairLaunch_json_1 = __importDefault(require("../abi/FairLaunch.json"));
const getContract = ({ abi, address }) => {
    if (!address)
        return;
    const web3 = new web3_1.default(window === null || window === void 0 ? void 0 : window.ethereum);
    return new web3.eth.Contract(abi, address);
};
const getErc20Contract = (address) => {
    return getContract({ abi: ERC20_json_1.default, address });
};
exports.getErc20Contract = getErc20Contract;
const getPresaleFactoryContract = (address) => {
    return getContract({
        abi: IdoPreSaleFactory_json_1.default,
        address: address,
    });
};
exports.getPresaleFactoryContract = getPresaleFactoryContract;
const getFairLaunchFactoryContract = (address) => {
    return getContract({
        abi: FairLaunchFactory_json_1.default,
        address,
    });
};
exports.getFairLaunchFactoryContract = getFairLaunchFactoryContract;
const getPresaleContract = (address) => {
    return getContract({
        abi: IdoPresale_json_1.default,
        address,
    });
};
exports.getPresaleContract = getPresaleContract;
const getFairlaunchContract = (address) => {
    return getContract({
        abi: FairLaunch_json_1.default,
        address,
    });
};
exports.getFairlaunchContract = getFairlaunchContract;
