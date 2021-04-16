import OrderStatus from '../enums/OrderStatusEnum';
export interface Order {
    order_id: string;
    name: string;
    status: OrderStatus;
    price: string;
}
export interface DynamoDBOrderParams {
    TableName: string;
    Item: Order;
}
