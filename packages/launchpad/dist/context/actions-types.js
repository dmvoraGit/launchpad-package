"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferType = exports.ActionType = void 0;
//enums
var ActionType;
(function (ActionType) {
    ActionType["SETADDRESS"] = "SETADDRESS";
    ActionType["STARTLOADING"] = "STARTLOADING";
    ActionType["STOPLOADING"] = "STOPLOADING";
    ActionType["SETTRANSACTION"] = "SETTRANSACTION";
    ActionType["SETPOOL"] = "SETPOOL";
    ActionType["SETIDODETAILS"] = "SETIDODETAILS";
})(ActionType || (exports.ActionType = ActionType = {}));
var OfferType;
(function (OfferType) {
    OfferType["PRESALE"] = "PreSale";
    OfferType["FAIRLAUNCH"] = "FairLaunch";
})(OfferType || (exports.OfferType = OfferType = {}));
