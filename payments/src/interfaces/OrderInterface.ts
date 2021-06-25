import OrderStatus from '../enums/OrderStatusEnum';
// import {AttributeValue} from '@aws-sdk/client-dynamodb/models/';

export interface Order {
  order_id: {S: string} ,
  name: {S: string},
  status: {S: OrderStatus},
  total: {S: string}
}