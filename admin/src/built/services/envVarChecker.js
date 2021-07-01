"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var envVarChecker = function (env) {
    var required = ['DYNAMODB_TABLE', 'EVENT_BUS'];
    var missing = [];
    required.forEach((function (reqVar) {
        if (!env[reqVar]) {
            missing.push(reqVar);
        }
    }));
    return missing;
};
exports.default = envVarChecker;
