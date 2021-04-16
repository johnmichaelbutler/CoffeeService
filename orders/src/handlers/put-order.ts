// Create clients and set shared const values outside of the handler.
import * as AWS from 'aws-sdk';
import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput, PutPartnerEventsRequest } from '@aws-sdk/client-eventbridge';
import dynamodb from 'aws-sdk/clients/dynamodb';
import {Order, DynamoDBOrderParam} from '../interfaces/OrderInterface';
import { APIGatewayProxyEvent } from 'aws-lambda';
import makeOrderId from '../services/order_id';
import OrderStatus from '../enums/OrderStatusEnum';

const docClient = new dynamodb.DocumentClient();

const eventBridgeClient = new EventBridgeClient({region: 'us-east-2'});

const tableName = process.env.DYNAMODB_TABLE;
console.log(`Name of Order DynamoDB Table: ${tableName}`)
const eventBus = process.env.EVENT_BUS;

if(tableName == undefined) {
  throw new Error('Table name must be defined!');
}
if(eventBus == undefined) {
  throw new Error('Event Bus must be defined!');
}

const saveOrderToDB = async (eventBody: Order) => {
  const { items, price, name, user_id } = eventBody;

  let order: Order = {
    order_id: makeOrderId(),
    status: OrderStatus.Created,
    name,
    user_id,
    items,
    price
  };

  let ddbParams: DynamoDBOrderParam = {
    TableName! : tableName,
    Item: order
  };

  const result = await docClient.put(ddbParams).promise();

  const response = {
    statusCode: 200,
    body: JSON.stringify(result)
  };
  return response;
};

const publishEventToEventBus = async (eventBody: Order) => {
  const { order_id, status, items, price } = eventBody;

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
  const command = new PutEventsCommand(eventBridgeParams);
  try {
    const eventBridgeResponse = await eventBridgeClient.send(command);
    console.log('Response from eventBridge', eventBridgeResponse);
    console.log('Successful EventBridge!')
    const response = {
      statusCode: 200,
      body: JSON.stringify(eventBridgeResponse)
    };
    return response;
  } catch (error) {
    console.log('Error sending to eventBridge', error);
    const response = {
      statusCode: 400,
      body: JSON.stringify(error)
    };
    return response;
  }
}
 // Creates an order and stores it to CoffeeService-Orders table
exports.putOrderHandler = async (event: APIGatewayProxyEvent) => {
	if (event.httpMethod !== 'POST') {
		throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
	}
	// All log statements are written to CloudWatch
	console.info('received:', event);

	// Get order information from body
	const body = JSON.parse(event.body!)

  const dbResponse = await saveOrderToDB(body);
  console.info(`response from: ${event.path} statusCode: ${dbResponse.statusCode} body: ${dbResponse.body}`);

  const eventResponse = await publishEventToEventBus(body);
  console.info(`response from: ${event.path} statusCode: ${eventResponse.statusCode} body: ${eventResponse.body}`);

  // All log statements are written to CloudWatch
  console.log('Starting putEvents action')
  const response = `dbResponse, ${dbResponse}; eventResponse ${eventResponse}`;
  return response;
}
