import { SSMClient, GetParameterCommand, GetParameterCommandInput } from '@aws-sdk/client-ssm';
import {DynamoDBClient, GetItemCommand, UpdateItemCommand, UpdateItemCommandInput} from '@aws-sdk/client-dynamodb';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import Stripe from 'stripe';
import OrderStatus from '../enums/OrderStatusEnum';
import { Order } from '../interfaces/OrderInterface';


const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;
const stripeParameterStoreName = process.env.STRIPE_PARAMETER_STORE_NAME;

if(tableName == undefined) {
  throw new Error('Table name must be defined!');
}
if(eventBus == undefined) {
  throw new Error('Event Bus must be defined!');
}

const ddbClient = new DynamoDBClient({region: 'us-east-2'});
const eventBridgeClient = new EventBridgeClient({region: 'us-east-2'});

let stripe: any;

// Get STRIPE secret key from parameter store
const getStripeKey = async () => {
  try {
    const ssmClient = new SSMClient({ region: 'us-east-2'});
    let input: GetParameterCommandInput = {
      Name: stripeParameterStoreName
    }
    const ssmCommand = new GetParameterCommand(input);
    const ssmResponse = await ssmClient.send(ssmCommand);
    return ssmResponse.Parameter?.Value;
  } catch (error) {
    console.log('Error Getting Stripe Key', error);
    return 'No Key';
  }
}


const getStripeClient = async () => {
  if(!stripe) {
    let stripeKey = await getStripeKey();
    stripe = new Stripe(stripeKey!, {
      apiVersion: '2020-08-27'
    });
  }
};

const runStripeCharge = async (totalForStripe: Number, token: String) => {
  await getStripeClient();
  try {
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: totalForStripe,
      source: token
    });
    return charge;
  } catch (error) {
    console.log("Error running stripe charge", error);
    return error;
  }
};

const getItemFromDB = async (order_id: any) => {
  try {
    const ddbInput = {
      TableName: tableName,
      Key: {
        order_id: {S: order_id}
      }
    };
    let {Item} = await ddbClient.send(new GetItemCommand(ddbInput));
    return Item;
  } catch (error) {
    console.log('Error from DB Call', error);
  }
};

const updateOrderInDB = async (Item: any) => {
  try {
    const ddbInput: UpdateItemCommandInput = {
      TableName: tableName,
      Key: {
        order_id: { S: Item.order_id.S}
      },
      UpdateExpression: `SET #s = :s`,
      ExpressionAttributeNames: {
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":s": {
          S: OrderStatus.Preparing
        }
      },
      ReturnValues: "ALL_NEW"
    };
    const command = new UpdateItemCommand(ddbInput);
    const response = await ddbClient.send(command);
    return response;
  } catch (error) {
    console.log("Error in updateOrderInDB", error);
    return error;
  }
};

const publishEventToEventBus = async (eventBody: any) => {
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
  const command = new PutEventsCommand(eventBridgeParams);
  try {
    const eventBridgeResponse = await eventBridgeClient.send(command);
    console.log('Response from eventBridge', eventBridgeResponse);
    console.log('Successful EventBridge!')
    return eventBridgeResponse;
  } catch (error) {
    console.log('Error sending to eventBridge', error);
    return error;
  }
};

exports.handlePaymentHandler = async (event: any) => {
  console.log('Successfully ran event!!!', event);
  const {order_id, totalForStripe, token} = JSON.parse(event.body);

  // Get Order from Payments database and check if it's ready for processing
  const itemToProcess = await getItemFromDB(order_id);

  console.log({itemToProcess});
  if(!itemToProcess) {
    return {
      statusCode: 400,
      body: 'No Item in DB matches this Order ID'
    }
  };

  // // Check to see if order is 'awaiting:payment', if not return not valid
  if(itemToProcess.status.S != OrderStatus.AwaitingPayment) {
    return {
      statusCode: 400,
      body: 'Order is no longer valid'
    }
  };

  // Run Stripe Charge and check if charge is valid
  let charge = await runStripeCharge(totalForStripe, token)

  if(charge.type == "StripeCardError") {
    return {
      statusCode: 402,
      body: "Error processing payment"
    }
  }

  // If successful, update item to be status 'preparing'
  const updateDBResponse = await updateOrderInDB(itemToProcess);
  const updatedItem = updateDBResponse.Attributes;

  // Send Event to EventBus with updated item
  await publishEventToEventBus(updatedItem);

  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Methods": "*",
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: "Payment Completed! Your Order is being made now!"
  }
  return response;
}