"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const makeOrderId = () => {
    return crypto_1.randomBytes(8).toString('hex');
};
exports.default = makeOrderId;
