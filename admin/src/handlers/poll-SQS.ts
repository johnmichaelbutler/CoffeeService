import {SQSClient, ReceiveMessageCommand, ReceiveMessageCommandInput} from "@aws-sdk/client-sqs";
import {BatchGetItemCommand, BatchGetItemCommandInput, DynamoDBClient} from '@aws-sdk/client-dynamodb';
import envVarChecker from "../services/envVarChecker";

const missing = envVarChecker(process.env, "pollSQSFunction");
if (missing.length > 0) {
  throw new Error('Environment variable missing: ${missing}');
};

const sqsUrl = process.env.SQS_URL;
const tableName = process.env.DYNAMODB_TABLE;

const sqsClient = new SQSClient({region: 'us-east-2'});
const ddbClient = new DynamoDBClient({region: 'us-east-2'});


const getOrders = async (messages: any) => {
    let orders: string[] = [];
    messages.forEach((message: any) => {
        let order = JSON.parse(message.Body);
        orders.push(order.detail.order_id.S);
    });
    return orders;
}

const getOrderItems = async (orderIds: string[]) => {
  const items = await getItemsFromDB(orderIds);
  return items;
}


const getItemsFromDB = async (orderIds: string[]) => {
  let orderKeys = orderIds.map((orderId) => {
    return {
      order_id: {
        S: orderId
      }
    }
  });

  const input: BatchGetItemCommandInput = {
    RequestItems: {
      'CoffeeService-Admin-AdminTable-L3WA2XNC8CZL': {
        "Keys": orderKeys,

    },
  },
  "ReturnConsumedCapacity": "TOTAL"
  };
  try {
    console.log('Input', JSON.stringify(input));

    const command = new BatchGetItemCommand(input);
    const response = await ddbClient.send(command);
    console.log('response from Database, getItemsFromDB', JSON.stringify(response));

    let orders = response!.Responses!['CoffeeService-Admin-AdminTable-L3WA2XNC8CZL'];

    let unfilteredOrders = orders.map((order) => {
      return {
        "Name": order.name.S,
        "order": order.items.L
      }
    });

    let ordersForClient = unfilteredOrders.map(individualOrder => {
      let items = individualOrder.order?.map(item => {
        return {
          "item": item?.M?.item.S,
          "quantity": item?.M?.quantity.S
        }
      });

      return {
        "name": individualOrder.Name,
        "items": items
      };
    });

    console.log('Items for each order', JSON.stringify(ordersForClient));
    return ordersForClient;
  } catch (error) {
    console.log('error in getItemsFromDB', error);
  }

};

exports.handlePollSQS = async () => {
  // Poll SQS for new messages

  try {
    let input: ReceiveMessageCommandInput = {
      QueueUrl: sqsUrl,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 5
    };

    const command = new ReceiveMessageCommand(input);
    const response = await sqsClient.send(command);
    console.log('SQS response', response);

    console.log('Table Name', tableName);
    const orderIds = await getOrders(response.Messages);
    console.log('orders', orderIds);

    const orders = await getOrderItems(orderIds);
    return orders;
  } catch (error) {
    console.log('error', error);
  }

  return null;
}
