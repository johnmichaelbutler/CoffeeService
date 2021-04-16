import OrderStatus from '../enums/OrderStatusEnum';

export interface Order {
  order_id: string,
  name: string,
  user_id: string,
  status: OrderStatus,
  items: {},
  price: string
}

export interface DynamoDBOrderParam {
  TableName: string,
  Item: Order
}
