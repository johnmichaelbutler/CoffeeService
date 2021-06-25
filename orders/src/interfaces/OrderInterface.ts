import OrderStatus from '../enums/OrderStatusEnum';

export interface Order {
  order_id: {S: string},
  name: {S: string},
  user_id: {S: string},
  status: {S: OrderStatus},
  items: {M: {}},
  total: {S: string}
}
