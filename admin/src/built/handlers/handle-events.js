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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
var envVarChecker_1 = __importDefault(require("../services/envVarChecker"));
var tableName = process.env.DYNAMODB_TABLE;
var missing = envVarChecker_1.default(process.env);
if (missing.length > 0) {
    throw new Error("Missing Environment Variables: " + missing);
}
var ddbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
var createOrderToAdminDB = function (eventBody) { return __awaiter(void 0, void 0, void 0, function () {
    var order_id, name, user_id, status, items, itemsForOrder, order, ddbParams, command, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                order_id = eventBody.order_id, name = eventBody.name, user_id = eventBody.user_id, status = eventBody.status, items = eventBody.items;
                itemsForOrder = items.L.map(function (item) {
                    return {
                        "M": {
                            "item": {
                                "S": item.M.item.S
                            },
                            "quantity": {
                                "S": item.M.quantity.S
                            }
                        }
                    };
                });
                order = {
                    items: { "L": itemsForOrder },
                    status: status,
                    order_id: order_id,
                    name: name,
                    user_id: user_id,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                ddbParams = {
                    Item: order,
                    TableName: tableName,
                };
                console.log('Params to PutItemCommand', JSON.stringify(ddbParams));
                command = new client_dynamodb_1.PutItemCommand(ddbParams);
                return [4 /*yield*/, ddbClient.send(command)];
            case 2:
                result = _a.sent();
                console.log("Successfully saved to Admin  DB: " + result);
                return [2 /*return*/, result];
            case 3:
                error_1 = _a.sent();
                console.error('Error saving to Admin DB', error_1);
                return [2 /*return*/, error_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
// This function should handle the event and update the admin db table if order is 'preparing'
exports.handleEventsHandler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, dbResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Event from payments/handleEventsHandler " + JSON.stringify(event));
                body = event.detail;
                console.log('Body from EventBridge', { body: body });
                if (!(body.status.S == OrderStatusEnum_1.default.Preparing)) return [3 /*break*/, 2];
                return [4 /*yield*/, createOrderToAdminDB(body)];
            case 1:
                dbResponse = _a.sent();
                console.info('Response from updateDB', dbResponse);
                _a.label = 2;
            case 2:
                ;
                return [2 /*return*/];
        }
    });
}); };
