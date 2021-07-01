"use strict";
// import { Order } from '../interfaces/OrderInterface';
// import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
// import OrderStatus from '../enums/OrderStatusEnum';
// import envVarChecker from '../services/envVarChecker';
// import {EventType, Detail} from '../interfaces/EventInterface';
// import {} from '@aws-sdk/client-eventbridge';
// const tableName = process.env.DYNAMODB_TABLE;
// const eventBus = process.env.EVENT_BUS;
// let missing = envVarChecker(process.env);
// if(missing.length > 0) {
//   throw new Error(`Missing Environment Variables: ${missing}`)
// }
// const ddbClient = new DynamoDBClient({region: 'us-east-2'});
// const updateOrderStatus = async (body: Order) => {
//   const {order_id, status} = body;
//   console.log('Table Name from updateOrderStatus', tableName);
//   const params: UpdateItemCommandInput = {
//     TableName: tableName,
//     Key: {
//       order_id: {
//         "S": order_id.S
//       }
//     },
//     ReturnConsumedCapacity: "TOTAL",
//     UpdateExpression: 'SET #stat = :status',
//     ExpressionAttributeValues: {
//       ":status": { "S": status.S }
//     },
//     ExpressionAttributeNames: {
//       "#stat": "status"
//     }
//   }
//   const command = new UpdateItemCommand(params);
//   let response;
//   try {
//     const dbResponse = await ddbClient.send(command);
//     console.log(`Response from Order DB Status Update: ${JSON.stringify(dbResponse)}`)
//     response = {
//       statusCode: 200,
//       body: dbResponse
//     }
//   } catch (error) {
//     console.log(`Error updating to Order DB order status: ${error}`);
//     response = {
//       statusCode: 200,
//       body: error
//     };
//   };
//   return response;
// };
// const publishAwaitPaymentEvent = async (eventBody: Order) => {
//   eventBody.status.S = OrderStatus.AwaitingPayment;
//   let eventBridgeParams = {
//     Entries: [
//       {
//         Detail: JSON.stringify(eventBody),
//         DetailType: eventBody.status.S,
//         EventBusName: eventBus,
//         Source: 'CoffeeService.payments'
//       }
//     ]
//   };
//   console.log(`Event Bus Name: ${eventBus}`)
//   const command = new PutEventsCommand(eventBridgeParams);
//   let response: Response;
//   try {
//     const eventBridgeResponse = await eventBridgeClient.send(command);
//     console.log(`Response from eventBridge: ${JSON.stringify(eventBridgeResponse)}`);
//     response = {
//       statusCode: 200,
//       body: JSON.stringify(eventBridgeResponse)
//     };
//   } catch (error) {
//     console.log(`Error sending to eventBridge: ${error}`)
//     response = {
//       statusCode: 400,
//       body: JSON.stringify(error)
//     }
//   };
//   return response;
// };
exports.completeOrderHandler = function () {
    // Response is a POST from API Gateway
    // Get order from Admin DB
    // Update Status to OrderStatus.complete in Admin DB
    // Send Event of OrderStatus.complete
    return 'Complete Order Handler';
};
