"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create clients and set shared const values outside of the handler
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const order_id_1 = __importDefault(require("../services/order_id"));
const OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const envVarChecker_1 = __importDefault(require("../services/envVarChecker"));
const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;
const missing = envVarChecker_1.default(process.env);
if (missing.length) {
    const vars = missing.join(', ');
    throw new Error(`Missing required environment variables: ${vars}`);
}
const eventBridgeClient = new client_eventbridge_1.EventBridgeClient({ region: 'us-east-2' });
const ddbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
const saveOrderToDB = async (eventBody) => {
    console.log('Event body in saveOrderToDB', eventBody);
    const { items, total, name, userId, status } = eventBody;
    let itemsForOrder = items.map((item) => {
        return {
            "M": {
                "item": {
                    "S": item.item
                },
                "quantity": {
                    "S": item.quantity.toString()
                }
            }
        };
    });
    let order = {
        "order_id": { "S": order_id_1.default() },
        "status": { "S": status },
        "name": { "S": name },
        "user_id": { "S": userId },
        "items": { "L": itemsForOrder },
        "total": { "S": total.toString() }
    };
    let ddbInput = {
        TableName: tableName,
        Item: order
    };
    try {
        console.log('Order', JSON.stringify(order));
        console.log('ddbInput', ddbInput);
        const command = new client_dynamodb_1.PutItemCommand(ddbInput);
        const dbResult = await ddbClient.send(command);
        console.log('result from saveOrderToDB', dbResult);
        return order;
    }
    catch (error) {
        console.log("Error saving to Database", error);
        return error;
    }
};
const publishEventToEventBus = async (order) => {
    console.log('Input for publishEventToEventBus', order);
    let eventBridgeParams = {
        Entries: [
            {
                Detail: JSON.stringify(order),
                DetailType: order.status.S,
                EventBusName: eventBus,
                Source: 'CoffeeService.orders',
            }
        ]
    };
    const command = new client_eventbridge_1.PutEventsCommand(eventBridgeParams);
    try {
        const eventBridgeResponse = await eventBridgeClient.send(command);
        console.log('Response from eventBridge', eventBridgeResponse);
        console.log('Successful EventBridge!');
        const response = {
            statusCode: 200,
            body: JSON.stringify(eventBridgeResponse)
        };
        return response;
    }
    catch (error) {
        console.log('Error sending to eventBridge', error);
        const response = {
            statusCode: 400,
            body: JSON.stringify(error)
        };
        return response;
    }
};
// Creates an order and stores it to CoffeeService-Orders table
exports.putOrderHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    // Get order information from body
    let body = JSON.parse(event.body);
    let body_with_status = Object.assign({ status: OrderStatusEnum_1.default.Created }, body);
    // Save order to database
    let order = await saveOrderToDB(body_with_status);
    // Send Event to EventBus
    console.log('Starting putEvents action');
    const eventResponse = await publishEventToEventBus(order);
    console.info(`response from: ${event.path} statusCode: ${eventResponse.statusCode} body: ${eventResponse.body}`);
    // All log statements are written to CloudWatch
    console.log(`eventResponse ${eventResponse}`);
    let response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: 'Order Created and awaiting payment!'
    };
    return response;
};
