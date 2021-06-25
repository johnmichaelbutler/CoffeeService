import OrderStatus from '../enums/OrderStatusEnum';

export interface Order {
  order_id: {S: string} ,
  name: {S: string},
  status: {S: OrderStatus},
  total: {S: string}
}