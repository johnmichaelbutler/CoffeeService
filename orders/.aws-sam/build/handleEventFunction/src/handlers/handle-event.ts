import { Order } from '../interfaces/OrderInterface';
import { Response } from '../interfaces/ResponseInterface';
import OrderStatus  from '../enums/OrderStatusEnum';
import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput  } from "@aws-sdk/client-dynamodb";


const tableName = process.env.DYNAMODB_TABLE;
console.log('Table Name: ', tableName);
const ddbClient = new DynamoDBClient({region: 'us-east-2'});

const updateOrderStatus = async (body: Order) => {
  const {order_id, status} = body;
  console.log('Table Name from updateOrderStatus', tableName);
  const params: UpdateItemCommandInput = {
    TableName: tableName,
    Key: {
      order_id: {
        "S": order_id
      }
    },
    ReturnConsumedCapacity: "TOTAL",
    UpdateExpression: 'SET #stat = :status',
    ExpressionAttributeValues: {
      ":status": { "S": status }
    },
    ExpressionAttributeNames: {
      "#stat": "status"
    }
  }
  const command = new UpdateItemCommand(params);
  let response: Response;
  try {
    const dbResponse = await ddbClient.send(command);
    console.log(`Response from Order DB Status Update: ${dbResponse}`)
    response = {
      statusCode: 200,
      body: dbResponse
    }
  } catch (error) {
    console.log(`Error updating to Order DB order status: ${error}`);
    response = {
      statusCode: 200,
      body: error
    };
  };
  return response;
}

exports.handleEventHandler = async (event: any) => {
  console.log(`Event from ${event.source}: ${event.detail["order_id"]} - ${event.detail["status"]}`);
  const body = event.detail;
  const {status} = body;
  console.log('Status: ', status);

  let response: Response;

  if (status == OrderStatus.AwaitingPayment) {
    const orderStatusResponse = await updateOrderStatus(body);
    response = orderStatusResponse;
    console.log(response);
  }


  return response!;
}
