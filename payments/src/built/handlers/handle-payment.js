"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_ssm_1 = require("@aws-sdk/client-ssm");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const stripe_1 = __importDefault(require("stripe"));
const OrderStatusEnum_1 = __importDefault(require("../enums/OrderStatusEnum"));
const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;
const stripeParameterStoreName = process.env.STRIPE_PARAMETER_STORE_NAME;
if (tableName == undefined) {
    throw new Error('Table name must be defined!');
}
if (eventBus == undefined) {
    throw new Error('Event Bus must be defined!');
}
const ddbClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-east-2' });
const eventBridgeClient = new client_eventbridge_1.EventBridgeClient({ region: 'us-east-2' });
let stripe;
// Get STRIPE secret key from parameter store
const getStripeKey = async () => {
    var _a;
    try {
        const ssmClient = new client_ssm_1.SSMClient({ region: 'us-east-2' });
        let input = {
            Name: stripeParameterStoreName
        };
        const ssmCommand = new client_ssm_1.GetParameterCommand(input);
        const ssmResponse = await ssmClient.send(ssmCommand);
        return (_a = ssmResponse.Parameter) === null || _a === void 0 ? void 0 : _a.Value;
    }
    catch (error) {
        console.log('Error Getting Stripe Key', error);
        return 'No Key';
    }
};
const getStripeClient = async () => {
    if (!stripe) {
        let stripeKey = await getStripeKey();
        stripe = new stripe_1.default(stripeKey, {
            apiVersion: '2020-08-27'
        });
    }
};
const runStripeCharge = async (totalForStripe, token) => {
    await getStripeClient();
    try {
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: totalForStripe,
            source: token
        });
        return charge;
    }
    catch (error) {
        console.log("Error running stripe charge", error);
        return error;
    }
};
const getItemFromDB = async (order_id) => {
    try {
        const ddbInput = {
            TableName: tableName,
            Key: {
                order_id: { S: order_id }
            }
        };
        let { Item } = await ddbClient.send(new client_dynamodb_1.GetItemCommand(ddbInput));
        return Item;
    }
    catch (error) {
        console.log('Error from DB Call', error);
    }
};
const updateOrderInDB = async (Item) => {
    try {
        const ddbInput = {
            TableName: tableName,
            Key: {
                order_id: { S: Item.order_id.S }
            },
            UpdateExpression: `SET #s = :s`,
            ExpressionAttributeNames: {
                "#s": "status"
            },
            ExpressionAttributeValues: {
                ":s": {
                    S: OrderStatusEnum_1.default.Preparing
                }
            },
            ReturnValues: "ALL_NEW"
        };
        const command = new client_dynamodb_1.UpdateItemCommand(ddbInput);
        const response = await ddbClient.send(command);
        return response;
    }
    catch (error) {
        console.log("Error in updateOrderInDB", error);
        return error;
    }
};
const publishEventToEventBus = async (eventBody) => {
    console.log('Input for publishEventToEventBus', eventBody);
    let eventBridgeParams = {
        Entries: [
            {
                Detail: JSON.stringify(eventBody),
                DetailType: eventBody.status.S,
                EventBusName: eventBus,
                Source: 'CoffeeService.payments',
            }
        ]
    };
    const command = new client_eventbridge_1.PutEventsCommand(eventBridgeParams);
    try {
        const eventBridgeResponse = await eventBridgeClient.send(command);
        console.log('Response from eventBridge', eventBridgeResponse);
        console.log('Successful EventBridge!');
        return eventBridgeResponse;
    }
    catch (error) {
        console.log('Error sending to eventBridge', error);
        return error;
    }
};
exports.handlePaymentHandler = async (event) => {
    console.log('Successfully ran event!!!', event);
    const { order_id, totalForStripe, token } = JSON.parse(event.body);
    // Get Order from Payments database and check if it's ready for processing
    const itemToProcess = await getItemFromDB(order_id);
    console.log({ itemToProcess });
    if (!itemToProcess) {
        return {
            statusCode: 400,
            body: 'No Item in DB matches this Order ID'
        };
    }
    ;
    // // Check to see if order is 'awaiting:payment', if not return not valid
    if (itemToProcess.status.S != OrderStatusEnum_1.default.AwaitingPayment) {
        return {
            statusCode: 400,
            body: 'Order is no longer valid'
        };
    }
    ;
    // Run Stripe Charge and check if charge is valid
    let charge = await runStripeCharge(totalForStripe, token);
    if (charge.type == "StripeCardError") {
        return {
            statusCode: 402,
            body: "Error processing payment"
        };
    }
    // If successful, update item to be status 'preparing'
    const updateDBResponse = await updateOrderInDB(itemToProcess);
    const updatedItem = updateDBResponse.Attributes;
    // Send Event to EventBus with updated item
    await publishEventToEventBus(updatedItem);
    let response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: "Payment Completed! Your Order is being made now!"
    };
    return response;
};
