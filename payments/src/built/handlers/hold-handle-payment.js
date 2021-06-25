"use strict";
// import { SSMClient, GetParameterCommand, GetParameterCommandInput } from '@aws-sdk/client-ssm';
// import {DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand} from '@aws-sdk/client-dynamodb';
// import Stripe from 'stripe';
// import OrderStatus from '../enums/OrderStatusEnum';
// import { Order, DynamoDBOrderParams } from '../interfaces/OrderInterface';
// import DynamoDB from 'aws-sdk/clients/dynamodb';
// const tableName = process.env.DYNAMODB_TABLE;
// const eventBus = process.env.EVENT_BUS;
// const stripeParameterStoreName = process.env.STRIPE_PARAMETER_STORE_NAME;
// if(tableName == undefined) {
//   throw new Error('Table name must be defined!');
// }
// if(eventBus == undefined) {
//   throw new Error('Event Bus must be defined!');
// }
// const ddbClient = new DynamoDBClient({region: 'us-east-2'});
// let stripe: any;
// // Get STRIPE secret key from parameter store
// const getStripeKey = async () => {
//   const ssmClient = new SSMClient({ region: 'us-east-2'});
//   let input: GetParameterCommandInput = {
//     Name: stripeParameterStoreName
//   }
//   const ssmCommand = new GetParameterCommand(input);
//   const ssmResponse = await ssmClient.send(ssmCommand);
//   return ssmResponse.Parameter?.Name;
// }
// const getStripeClient = async () => {
//   if(!stripe) {
//     let stripeKey = await getStripeKey();
//     stripe = new Stripe(stripeKey!, {
//       apiVersion: '2020-08-27'
//     });
//   }
// };
// const getItemFromDB = async (order_id: any) => {
//   const ddbInput = {
//     TableName: tableName,
//     Key: order_id
//   }
//   const command = new GetItemCommand(ddbInput);
//   const {Item} = await ddbClient.send(command);
//   return Item;
// };
// const updateOrderInDB = async (Item: any) => {
//   const ddbInput = {
//     TableName: tableName,
//     Item: {...Item, status: OrderStatus.Preparing}
//   }
//   const command = new PutItemCommand(ddbInput);
//   const response = await ddbClient.send(command);
//   return response;
// };
exports.handlePaymentHandler = async (event) => {
    console.log('Successfully ran event!!!', event);
    // const {order_id, totalForStripe, token} = JSON.parse(event.body);
    // console.log({order_id}, {totalForStripe}, {token})
    //   // Get Order from Payments database and check if it's ready for processing
    // const itemToProcess = await getItemFromDB(order_id);
    // console.log{{itemToProcess}}
    // if(!itemToProcess) {
    //   return {
    //     statusCode: 400,
    //     body: 'No Item in DB matches this Order ID'
    //   }
    // };
    //   // Check to see if order is 'awaiting:payment', if not return not valid
    //   // @ts-ignore
    //   if(itemToProcess.status != OrderStatus.AwaitingPayment) {
    //     return {
    //       statusCode: 400,
    //       body: 'Order is no longer valid'
    //     }
    //   };
    //   // Build Stripe Client if one isn't present
    //   await getStripeClient();
    //   // Create stripe charge
    //   const charge = await stripe.charges.create({
    //     currency: 'usd',
    //     amount: totalForStripe,
    //     source: token
    //   });
    //   console.log({charge});
    //   // If successful, update item to be status 'order:paid
    //   const updateDBResponse = await updateOrderInDB(itemToProcess);
    //   console.log({updateDBResponse});
    // // Todo: Send Event
    let response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: "Event Ran!"
    };
    return response;
};
