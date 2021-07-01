import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import OrderStatus from '../enums/OrderStatusEnum';
import envVarChecker from '../services/envVarChecker';
import {EventType, Detail} from '../interfaces/EventInterface';
import {} from '@aws-sdk/client-eventbridge';


const tableName = process.env.DYNAMODB_TABLE;

let missing = envVarChecker(process.env);
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


// This function should handle the event and update the admin db table if order is 'preparing'
exports.handleEventsHandler = async (event: EventType) => {
  console.log(`Event from payments/handleEventsHandler ${JSON.stringify(event)}`);
  const body = event.detail;
  console.log('Body from EventBridge', {body});

  if(body.status.S == OrderStatus.Preparing) {
    // Update database
    const dbResponse = await createOrderToAdminDB(body);
    console.info('Response from updateDB', dbResponse);
  };
};




