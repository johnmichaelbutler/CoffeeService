import { DynamoDBClient, PutItemCommand, PutItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import envVarChecker from '../services/envVarChecker';
import {EventType, Detail} from '../interfaces/EventInterface';


const tableName = process.env.DYNAMODB_TABLE;

let missing = envVarChecker(process.env, "handleEventsFunction");
if(missing.length > 0) {
  throw new Error(`Missing Environment Variables: ${missing}`)
}

const ddbClient = new DynamoDBClient({region: 'us-east-2'});

const createOrderToAdminDB = async (eventBody: Detail) => {
  const {order_id, name, user_id, status, items } = eventBody;


  let itemsForOrder = items.L.map((item: any) => {
    return {
      "M" : {
        "item": {
          "S": item.M.item.S
        },
        "quantity": {
          "S": item.M.quantity.S
        }
      }
    }
  });

  let order = {
    items: {"L": itemsForOrder},
    status,
    order_id,
    name,
    user_id,
  };

  try {
    const ddbParams: PutItemCommandInput = {
      Item: order,
      TableName: tableName,
    };
    console.log('Params to PutItemCommand',JSON.stringify(ddbParams));
    const command = new PutItemCommand(ddbParams);
    const result = await ddbClient.send(command);
    console.log(`Successfully saved to Admin  DB: ${result}`);
    return result;
  } catch (error) {
    console.error('Error saving to Admin DB', error);
    return error;
  }
};

const updateOrderStatus = async (body: any) => {
  const {order_id, status} = body;

  const params: UpdateItemCommandInput = {
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

  const command = new UpdateItemCommand(params);
  let response;

  try {
    const dbResponse = await ddbClient.send(command);
    console.log(`Response from Admin DB Status Update: ${JSON.stringify(dbResponse)}`)
    response = {
      statusCode: 200,
      body: dbResponse
    }
  } catch (error) {
    console.log(`Error updating to Admin DB order status: ${error}`);
    response = {
      statusCode: 200,
      body: error
    };
  };
  return response;
}

// This function should handle the event and update the admin db table if order is 'preparing'
exports.handleEventsHandler = async (event: EventType) => {
  console.log(`Event from payments/handleEventsHandler ${JSON.stringify(event)}`);
  const body = event.detail;
  console.log('Body from EventBridge', {body});

  if(event.source === 'CoffeeService.orders') {
    // Create order in Admin DB
    const dbResponse = await createOrderToAdminDB(body);
    console.log('Response from saving order to DB', dbResponse);
  }

  if(event.source === 'CoffeeService.payments') {
    // Update order status in DB
    const dbResponse = await updateOrderStatus(body);
    console.info('Response from updateDB', dbResponse);
  };
};




