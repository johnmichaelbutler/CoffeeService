"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var envVarChecker = function (env, fnName) {
    var requiredEnvVars = {
        "handleEventsFunction": ['DYNAMODB_TABLE', 'EVENT_BUS'],
        "pollSQSFunction": ['EVENT_BUS', 'SQS_URL', 'DYNAMODB_TABLE'],
        "completeOrderFunction": ['EVENT_BUS']
    };
    var missing = [];
    var required = requiredEnvVars[fnName];
    required.forEach((function (reqVar) {
        if (!env[reqVar]) {
            missing.push(reqVar);
        }
    }));
    return missing;
};
exports.default = envVarChecker;
