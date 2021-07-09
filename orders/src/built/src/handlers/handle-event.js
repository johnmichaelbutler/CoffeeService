"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tableName = process.env.DYNAMODB_TABLE;
const ddbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
const updateOrderStatus = async (body) => {
    const { order_id, status } = body;
    console.log('Table Name from updateOrderStatus', tableName);
    const params = {
        TableName: tableName,
        Key: {
            order_id: {
                "S": order_id.S
            }
        },
        ReturnConsumedCapacity: "TOTAL",
        UpdateExpression: 'SET #stat = :status',
        ExpressionAttributeValues: {
            ":status": { "S": status.S }
        },
        ExpressionAttributeNames: {
            "#stat": "status"
        }
    };
    const command = new client_dynamodb_1.UpdateItemCommand(params);
    let response;
    try {
        const dbResponse = await ddbClient.send(command);
        console.log(`Response from Order DB Status Update: ${JSON.stringify(dbResponse)}`);
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
    console.log(`Event from ${event.source}: ${JSON.stringify(event)}`);
    const body = event.detail;
    const status = body.status.S;
    console.log('Status: ', status);
    let response;
    if (event.source == "CoffeeService.payments") {
        const orderStatusResponse = await updateOrderStatus(body);
        response = orderStatusResponse;
        console.log(response);
    }
    return response;
};
