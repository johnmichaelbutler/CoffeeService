import stripe from 'stripe';

const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;

if(tableName == undefined) {
  throw new Error('Table name must be defined!');
}
if(eventBus == undefined) {
  throw new Error('Event Bus must be defined!');
}

exports.handlePaymentHandler = async (event: any) => {
  console.log('Successfully ran event', event);
  let response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Methods": "*",
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: "Event Ran!"
  }
  return response;
}