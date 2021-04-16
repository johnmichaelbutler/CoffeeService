"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tableName = process.env.DYNAMODB_TABLE;
console.log('Table Name: ', tableName);
const ddbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
const updateOrderStatus = async (body) => {
    const { order_id, status } = body;
    console.log('Table Name from updateOrderStatus', tableName);
    const params = {
        TableName: tableName,
        Key: {
            order_id: {
                "S": order_id
            }
        },
        ReturnConsumedCapacity: "TOTAL",
        UpdateExpression: 'SET #stat = :status',
        ExpressionAttributeValues: {
            ":status": { "S": status }
        },
        ExpressionAttributeNames: {
            "#stat": "status"
        }
    };
    const command = new client_dynamodb_1.UpdateItemCommand(params);
    let response;
    try {
        const dbResponse = await ddbClient.send(command);
        console.log(`Response from Order DB Status Update: ${dbResponse}`);
        response = {
            statusCode: 200,
            body: dbResponse
        };
    }
    catch (error) {
        console.log(`Error updating to Order DB order status: ${error}`);
        response = {
            statusCode: 200,
            body: error
        };
    }
    ;
    return response;
};
exports.handleEventHandler = async (event) => {
    console.log(`Event from ${event.source}: ${event.detail["order_id"]} - ${event.detail["status"]}`);
    const body = event.detail;
    const { status } = body;
    console.log('Status: ', status);
    let response;
    if (status == OrderStatusEnum_1.default.AwaitingPayment) {
        const orderStatusResponse = await updateOrderStatus(body);
        response = orderStatusResponse;
        console.log(response);
    }
    return response;
};
