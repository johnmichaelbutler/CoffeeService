"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "created";
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    OrderStatus["Preparing"] = "preparing";
    OrderStatus["Complete"] = "complete";
})(OrderStatus || (OrderStatus = {}));
;
exports.default = OrderStatus;
