"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const order_id_1 = __importDefault(require("../services/order_id"));
const OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
const docClient = new dynamodb_1.default.DocumentClient();
const eventBridgeClient = new client_eventbridge_1.EventBridgeClient({ region: 'us-east-2' });
const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;
if (tableName == undefined) {
    throw new Error('Table name must be defined!');
}
if (eventBus == undefined) {
    throw new Error('Event Bus must be defined!');
}
const saveOrderToDB = async (eventBody) => {
    const { items, total, name, user_id, status } = eventBody;
    let order = {
        order_id: order_id_1.default(),
        status,
        name,
        user_id,
        items,
        total
    };
    let ddbParams = {
        TableName: tableName,
        Item: order
    };
    const result = await docClient.put(ddbParams).promise();
    console.log('result from saveOrderToDB', result);
    const response = {
        statusCode: 200,
        body: JSON.stringify(order)
    };
    return response;
};
const publishEventToEventBus = async (eventBody) => {
    console.log('Input for publishEventToEventBus', eventBody);
    let eventBridgeParams = {
        Entries: [
            {
                Detail: JSON.stringify(eventBody),
                DetailType: eventBody.status,
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
    const dbResponse = await saveOrderToDB(body_with_status);
    console.info(`response from: ${event.path} statusCode: ${dbResponse.statusCode} body: ${dbResponse.body}`);
    console.log('Starting putEvents action');
    let event_body = JSON.parse(dbResponse.body);
    const eventResponse = await publishEventToEventBus(event_body);
    console.info(`response from: ${event.path} statusCode: ${eventResponse.statusCode} body: ${eventResponse.body}`);
    // All log statements are written to CloudWatch
    console.log(`dbResponse, ${dbResponse}; eventResponse ${eventResponse}`);
    let response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventResponse, dbResponse })
    };
    return response;
};
