import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { Order } from '../interfaces/OrderInterface';
import { Response } from '../interfaces/ResponseInterface';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import OrderStatus from '../enums/OrderStatusEnum';


const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;

if(tableName == undefined) {
  throw new Error('Table name must be defined!');
}
if(eventBus == undefined) {
  throw new Error('Event Bus must be defined!');
}

const ddbClient = new DynamoDBClient({region: 'us-east-2'});
const eventBridgeClient = new EventBridgeClient({region: 'us-east-2'});

const updateDB = async (eventBody: Order) => {
  const {order_id, total, name } = eventBody;
  let newStatus = OrderStatus.AwaitingPayment;

  let order = {
    order_id: order_id,
    status: {S: newStatus},
    name: name,
    total: total
  };

  try {
    const ddbParams: PutItemCommandInput = {
      Item: order,
      TableName: tableName,
    };
    console.log({ddbParams});
    const command = new PutItemCommand(ddbParams);
    const result = await ddbClient.send(command);
    console.log(`Successfully saved to Payments  DB: ${result}`);
    return result;
  } catch (error) {
    console.error('Error saving to Payments DB', error);
    return error;
  }
};

const publishAwaitPaymentEvent = async (eventBody: Order) => {
  eventBody.status.S = OrderStatus.AwaitingPayment;

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
  const { order_id, status, total, name } = body;
  console.log('Body from EventBridge', order_id, status, total, name);

  if(status == 'created') {
    // Save to Database, where status is updated to 'awaiting_payment'
    const dbResponse = await updateDB(body);
    console.info(`Response Status Code: ${dbResponse.statusCode}; Response body: ${dbResponse.body}`);

    // Send Event which updates other services order status to 'awaiting_payment'
    const eventResponse = await publishAwaitPaymentEvent(body);
    console.log(`EventBridge Response: ${eventResponse}`);
  }
}