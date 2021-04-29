"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
// const docClient = new DynamoDBClient({region: 'us-east-2'});
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
const updateDB = async (eventBody) => {
    const { order_id, total, name } = eventBody;
    let order = {
        order_id: order_id,
        status: OrderStatusEnum_1.default.AwaitingPayment,
        name: name,
        total: total
    };
    const ddbParams = {
        TableName: tableName,
        Item: order
    };
    let response;
    try {
        console.log({ ddbParams });
        const result = await docClient.put(ddbParams).promise();
        console.log(`Successfully saved to Payments  DB: ${result}`);
        response = {
            statusCode: 200,
            body: result
        };
    }
    catch (error) {
        console.error('Error saving to Payments DB', error);
        response = {
            statusCode: 200,
            body: error
        };
    }
    return response;
};
const publishAwaitPaymentEvent = async (eventBody) => {
    eventBody.status = OrderStatusEnum_1.default.AwaitingPayment;
    let eventBridgeParams = {
        Entries: [
            {
                Detail: JSON.stringify(eventBody),
                DetailType: eventBody.status,
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
        console.log(`Response from eventBridge: ${eventBridgeResponse}`);
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
    console.log(body);
    const { order_id, status, total, name } = body;
    console.log('Body from EventBridge', order_id, status, total, name);
    if (status == 'created') {
        // Save to Database, where status is updated to 'awaiting_payment'
        const dbResponse = await updateDB(body);
        console.info(`Response Status Code: ${dbResponse.statusCode}; Response body: ${dbResponse.body}`);
        // Send Event which updates other services order status to 'awaiting_payment'
        const eventResponse = await publishAwaitPaymentEvent(body);
        console.log(`EventBridge Response: ${eventResponse}`);
    }
};
