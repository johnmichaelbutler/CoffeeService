"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envVarChecker = (env) => {
    const required = ['DYNAMODB_TABLE', 'EVENT_BUS'];
    const missing = [];
    required.forEach((reqVar => {
        if (!env[reqVar]) {
            missing.push(reqVar);
        }
    }));
    return missing;
};
exports.default = envVarChecker;
