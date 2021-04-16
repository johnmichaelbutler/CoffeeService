import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import dynamodb from 'aws-sdk/clients/dynamodb';
import { Order, DynamoDBOrderParams } from '../interfaces/OrderInterface';
import { Response } from '../interfaces/ResponseInterface';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import {APIGatewayProxyEvent} from 'aws-lambda';
import OrderStatus from '../enums/OrderStatusEnum';

// const docClient = new DynamoDBClient({region: 'us-east-2'});

const docClient = new dynamodb.DocumentClient();

const eventBridgeClient = new EventBridgeClient({region: 'us-east-2'});

const tableName = process.env.DYNAMODB_TABLE;
console.log('Name of dynamodb table',tableName);
const eventBus = process.env.EVENT_BUS;

if(tableName == undefined) {
  throw new Error('Table name must be defined!');
}
if(eventBus == undefined) {
  throw new Error('Event Bus must be defined!');
}

const updateDB = async (eventBody: Order) => {
  const {order_id, status, price, name } = eventBody;

  let order: Order = {
    order_id: order_id,
    status: OrderStatus.AwaitingPayment,
    name: name,
    price: price
  };

  const ddbParams: DynamoDBOrderParams = {
    TableName: tableName,
    Item: order
  };

  let response: Response;

  try {
    console.log({ddbParams});
    const result = await docClient.put(ddbParams).promise();
    console.log(`Successfully saved to Payments  DB: ${result}`);
    response = {
      statusCode: 200,
      body: result
    };
  } catch (error) {
    console.error('Error saving to Payments DB', error);
    response = {
      statusCode: 200,
      body: error
    }
  }
  return response;
};

const publishAwaitPaymentEvent = async (eventBody: Order) => {
  eventBody.status = OrderStatus.AwaitingPayment;

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
  console.log(`Event Bus Name: ${eventBus}`)

  const command = new PutEventsCommand(eventBridgeParams);
  let response: Response;

  try {
    const eventBridgeResponse = await eventBridgeClient.send(command);
    console.log(`Response from eventBridge: ${eventBridgeResponse}`);
    response = {
      statusCode: 200,
      body: JSON.stringify(eventBridgeResponse)
    };
  } catch (error) {
    console.log(`Error sending to eventBridge: ${error}`)
    response = {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  };
  return response;
};

// This function should handle the event and update the payments db table to include the order
exports.handleEventsHandler = async (event: any) => {
  console.log(`Event from payments/handleEventsHandler ${JSON.stringify(event)}`);
  const body = event.detail;
  console.log(body)
  const { order_id, status, price, name } = body;
  console.log('Body from EventBridge', order_id, status, price, name);

  if(status == 'created') {
    // Save to Database, where status is updated to 'awaiting_payment'
    const dbResponse = await updateDB(body);
    console.info(`Response Status Code: ${dbResponse.statusCode}; Response body: ${dbResponse.body}`);

    // Send Event which updates other services order status to 'awaiting_payment'
    const eventResponse = await publishAwaitPaymentEvent(body);
    console.log(`EventBridge Response: ${eventResponse}`);


  }

}