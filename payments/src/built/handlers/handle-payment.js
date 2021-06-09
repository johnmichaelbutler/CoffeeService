"use strict";
const tableName = process.env.DYNAMODB_TABLE;
const eventBus = process.env.EVENT_BUS;
if (tableName == undefined) {
    throw new Error('Table name must be defined!');
}
if (eventBus == undefined) {
    throw new Error('Event Bus must be defined!');
}
exports.handlePaymentHandler = async (event) => {
    console.log('Successfully ran event', event);
};
