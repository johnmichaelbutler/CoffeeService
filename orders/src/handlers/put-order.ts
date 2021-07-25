// Create clients and set shared const values outside of the handler
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { Order } from '../interfaces/OrderInterface';
import { APIGatewayProxyEvent } from 'aws-lambda';
import makeOrderId from '../services/order_id';
import OrderStatus from '../enums/OrderStatusEnum';
import { PutItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import checker from '../services/envVarChecker';

const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;

const missing = checker(process.env);
if(missing.length) {
  const vars = missing.join(', ');
  throw new Error(`Missing required environment variables: ${vars}`);
}


const eventBridgeClient = new EventBridgeClient({region: 'us-east-2'});
const ddbClient = new DynamoDBClient({region: 'us-east-2'});


const saveOrderToDB = async (eventBody: any) => {
  console.log('Event body in saveOrderToDB', eventBody);
  const { items, total, name, userId, status } = eventBody;

  let itemsForOrder = items.map((item: any) => {
    return {
      "M" : {
        "item": {
          "S": item.item
        },
        "quantity": {
          "S": item.quantity.toString()
        }
      }
    }
  });

  let order = {
    "order_id": {"S": makeOrderId()},
    "status": {"S": status},
    "name": {"S": name},
    "user_id": {"S": userId},
    "items": {"L": itemsForOrder},
    "total": {"S": total.toString()}
  };

  let ddbInput = {
    TableName: tableName,
    Item: order
  };
  try {
    console.log('Order', JSON.stringify(order));
    console.log('ddbInput', ddbInput)
    const command = new PutItemCommand(ddbInput);
    const dbResult = await ddbClient.send(command);
    console.log('result from saveOrderToDB', dbResult);
    return order;
  } catch (error) {
    throw new Error(`Error saving to Database error ${error}`);
    return error;
  }
};

const publishEventToEventBus = async (order: Order) => {
  console.log('Input for publishEventToEventBus', order);

  let eventBridgeParams = {
    Entries: [
      {
        Detail: JSON.stringify(order),
        DetailType: order.status.S,
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
};

 // Creates an order and stores it to CoffeeService-Orders table
exports.putOrderHandler = async (event: APIGatewayProxyEvent) => {
	if (event.httpMethod !== 'POST') {
		throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
	}
	// All log statements are written to CloudWatch
	console.info('received:', event);

	// Get order information from body
	let body = JSON.parse(event.body!);
  let body_with_status: Order = {status: OrderStatus.Created, ...body};

  // Save order to database
  let order = await saveOrderToDB(body_with_status);

  // Send Event to EventBus
  console.log('Starting putEvents action')
  const eventResponse = await publishEventToEventBus(order);
  console.info(`response from: ${event.path} statusCode: ${eventResponse.statusCode} body: ${eventResponse.body}`);

  // All log statements are written to CloudWatch
  console.log(`eventResponse ${eventResponse}`);
  console.log('Building the final response');
  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Methods": "*",
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  };
  console.log('Final response from order/put-order.ts', response);
  return response;
};
