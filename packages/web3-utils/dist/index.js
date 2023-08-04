"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalAmountOfApproveForFairLaunch = exports.getTotalAmountOfApproveForPresale = exports.unixTimeStamp = exports.formatCurrency = exports.isNumber = exports.resetCurrencyFormatting = exports.formatLargeNumber = exports.getNativeBalance = exports.tokenAmount = exports.checkEnoughTokens = exports.tokenInfo = exports.revertedError = exports.calCulateOutputTokenAmount = exports.fromWei = exports.toWei = exports.isMetaMaskInstalled = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const web3_1 = __importDefault(require("web3"));
const ERC20_json_1 = __importDefault(require("./abi/ERC20.json"));
bignumber_js_1.default.config({ EXPONENTIAL_AT: 1e9 });
const isMetaMaskInstalled = () => {
    return typeof window.web3 !== "undefined";
};
exports.isMetaMaskInstalled = isMetaMaskInstalled;
const toWei = (amount, decimals = 18) => {
    try {
        if (!amount) {
            return new bignumber_js_1.default(0).toString();
        }
        return new bignumber_js_1.default(amount)
            .multipliedBy(new bignumber_js_1.default(10).exponentiatedBy(decimals))
            .toFixed(0)
            .toString();
    }
    catch (error) {
        console.log("exeption in toWei , ", error);
        return "0";
    }
};
exports.toWei = toWei;
const fromWei = (amount, decimals = 18) => {
    try {
        if (!amount) {
            return new bignumber_js_1.default(0).toString();
        }
        return new bignumber_js_1.default(amount)
            .div(new bignumber_js_1.default(10).exponentiatedBy(decimals))
            .toString();
    }
    catch (error) {
        console.log("exeption in fromWei ", error);
        return null;
    }
};
exports.fromWei = fromWei;
const calCulateOutputTokenAmount = (amount, tokenrate, decimals = 18) => {
    try {
        if (!amount || !tokenrate) {
            return new bignumber_js_1.default(0).toString();
        }
        return new bignumber_js_1.default(amount)
            .multipliedBy(new bignumber_js_1.default(10).exponentiatedBy(decimals))
            .multipliedBy(tokenrate)
            .toString();
    }
    catch (error) {
        console.log("exeption in toWei , ", error);
        return null;
    }
};
exports.calCulateOutputTokenAmount = calCulateOutputTokenAmount;
const revertedError = (error, index = 1) => {
    console.log("error.message", error.message);
    const parsedError = JSON.stringify(error.message);
    console.log("parsedError", parsedError);
    const msg = parsedError === null || parsedError === void 0 ? void 0 : parsedError.split(`'`);
    let message = [];
    msg === null || msg === void 0 ? void 0 : msg.map((err) => {
        if (!err.includes("\\") && !err.includes('"\\') && !err.includes("[")) {
            !(err === null || err === void 0 ? void 0 : err.startsWith("\\")) && message.push(err);
        }
    });
    console.log("msg", message);
    return message[0];
};
exports.revertedError = revertedError;
const tokenInfo = ({ address }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const web3 = new web3_1.default(window.ethereum);
        const _erc20Contract = new web3.eth.Contract(ERC20_json_1.default, address);
        const result = yield Promise.all([
            _erc20Contract.methods.name().call(),
            _erc20Contract.methods.symbol().call(),
            _erc20Contract.methods.decimals().call(),
            _erc20Contract.methods.totalSupply().call(),
        ]);
        return result;
    }
    catch (err) {
        console.log("err", err);
        const parsedError = JSON.stringify(err.message);
        if (parsedError.includes("reverted with reason ")) {
            console.log("(revertedError(err))", (0, exports.revertedError)(err));
            return (0, exports.revertedError)(err);
        }
        return err === null || err === void 0 ? void 0 : err.message;
    }
});
exports.tokenInfo = tokenInfo;
const checkEnoughTokens = (tokens, hardCap, tokenrate, decimals = 18) => {
    try {
        if (!tokens || !hardCap || !tokenrate) {
            return false;
        }
        const allocation = new bignumber_js_1.default(tokens).multipliedBy(new bignumber_js_1.default(10).exponentiatedBy(decimals));
        const hardcap = new bignumber_js_1.default(hardCap);
        const rate = new bignumber_js_1.default(tokenrate);
        return hardcap
            .multipliedBy(rate)
            .multipliedBy(new bignumber_js_1.default(10).exponentiatedBy(decimals))
            .lte(allocation);
    }
    catch (error) {
        console.log("exeption in fromWei ", error);
        return null;
    }
};
exports.checkEnoughTokens = checkEnoughTokens;
const tokenAmount = (hardCap, tokenrate, decimals = 18) => {
    try {
        if (!hardCap || !tokenrate) {
            return false;
        }
        const hardcap = new bignumber_js_1.default(hardCap);
        const rate = new bignumber_js_1.default(tokenrate);
        return hardcap
            .multipliedBy(rate)
            .multipliedBy(new bignumber_js_1.default(10).exponentiatedBy(decimals));
    }
    catch (error) {
        console.log("exeption in fromWei ", error);
        return null;
    }
};
exports.tokenAmount = tokenAmount;
const getNativeBalance = (address) => __awaiter(void 0, void 0, void 0, function* () {
    let web3 = new web3_1.default(window.ethereum);
    return web3.eth.getBalance(address);
});
exports.getNativeBalance = getNativeBalance;
function convertToInternationalCurrencySystem(labelValue, formatter) {
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
const formatLargeNumber = (value, precision = 2) => {
    const _value = !value ? 0 : value;
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: precision,
    });
    const formattedValue = convertToInternationalCurrencySystem(_value, formatter);
    return formattedValue;
};
exports.formatLargeNumber = formatLargeNumber;
const resetCurrencyFormatting = (value) => {
    return value.split(",").join("");
};
exports.resetCurrencyFormatting = resetCurrencyFormatting;
const isNumber = (value) => {
    return !isNaN(parseInt(value));
};
exports.isNumber = isNumber;
const formatCurrency = (value, usd = false, fractionDigits = 1, currencyFormat = false) => {
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
        return convertToInternationalCurrencySystem(value ? value : 0, formatter);
    }
    return formatter.format(value ? value : 0).slice(1);
};
exports.formatCurrency = formatCurrency;
const unixTimeStamp = (date) => {
    return Math.floor(new Date(date).getTime() / 1000);
};
exports.unixTimeStamp = unixTimeStamp;
//for presale
const getTotalAmountOfApproveForPresale = ({ tokenRate, hardCap, liquidityPc, LiquidityRate, }) => {
    return (0, bignumber_js_1.default)(tokenRate)
        .times(hardCap)
        .plus((0, bignumber_js_1.default)(hardCap).times(liquidityPc).div(100).times(LiquidityRate))
        .toString();
};
exports.getTotalAmountOfApproveForPresale = getTotalAmountOfApproveForPresale;
//for presale
const getTotalAmountOfApproveForFairLaunch = ({ tokenForsale, liquidityPc, }) => {
    return Number(liquidityPc) === 0
        ? (0, bignumber_js_1.default)(tokenForsale)
            .times(liquidityPc)
            .div(100)
            .plus(tokenForsale)
            .toString()
        : (0, bignumber_js_1.default)(tokenForsale).toString();
};
exports.getTotalAmountOfApproveForFairLaunch = getTotalAmountOfApproveForFairLaunch;
