"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;
if (tableName == undefined) {
    throw new Error('Table name must be defined!');
}
if (eventBus == undefined) {
    throw new Error('Event Bus must be defined!');
}
const ddbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
const eventBridgeClient = new client_eventbridge_1.EventBridgeClient({ region: 'us-east-2' });
const updateDB = async (eventBody) => {
    const { order_id, total, name, user_id } = eventBody;
    let newStatus = OrderStatusEnum_1.default.AwaitingPayment;
    let order = {
        status: { S: newStatus },
        order_id,
        name,
        total,
        user_id
    };
    try {
        const ddbParams = {
            Item: order,
            TableName: tableName,
        };
        console.log({ ddbParams });
        const command = new client_dynamodb_1.PutItemCommand(ddbParams);
        const result = await ddbClient.send(command);
        console.log(`Successfully saved to Payments  DB: ${result}`);
        return result;
    }
    catch (error) {
        console.error('Error saving to Payments DB', error);
        return error;
    }
};
const publishAwaitPaymentEvent = async (eventBody) => {
    eventBody.status.S = OrderStatusEnum_1.default.AwaitingPayment;
    let eventBridgeParams = {
        Entries: [
            {
                Detail: JSON.stringify(eventBody),
                DetailType: eventBody.status.S,
                EventBusName: eventBus,
                Source: 'CoffeeService.payments'
            }
        ]
    };
    console.log(`Event Bus Name: ${eventBus}`);
    const command = new client_eventbridge_1.PutEventsCommand(eventBridgeParams);
    let response;
    try {
        const eventBridgeResponse = await eventBridgeClient.send(command);
        console.log(`Response from eventBridge: ${JSON.stringify(eventBridgeResponse)}`);
        response = {
            statusCode: 200,
            body: JSON.stringify(eventBridgeResponse)
        };
    }
    catch (error) {
        console.log(`Error sending to eventBridge: ${error}`);
        response = {
            statusCode: 400,
            body: JSON.stringify(error)
        };
    }
    ;
    return response;
};
// This function should handle the event and update the payments db table to include the order
exports.handleEventsHandler = async (event) => {
    console.log(`Event from payments/handleEventsHandler ${JSON.stringify(event)}`);
    const body = event.detail;
    console.log({ body });
    const { order_id, status, total, name } = body;
    console.log('Body from EventBridge', order_id, status, total, name);
    if (status.S == 'created') {
        // Save to Database, where status is updated to 'awaiting_payment'
        const dbResponse = await updateDB(body);
        console.info('Response from updateDB', dbResponse);
        // Send Event which updates other services order status to 'awaiting_payment'
        const eventResponse = await publishAwaitPaymentEvent(body);
        console.log(`EventBridge Response: ${JSON.stringify(eventResponse)}`);
    }
};
