import OrderStatus from '../enums/OrderStatusEnum';

export interface EventType {
  "version": string,
  "id": string,
  "detail-type": string,
  "source": string,
  "account": string,
  "time": string,
  "region": string,
  "resources": [],
  "detail": Detail
}

export interface Detail {
  "order_id": {"S": string},
  "status": {"S": OrderStatus},
  "name": {"S": string},
  "user_id": {"S": string},
  "items": {"L": Array<object>},
  "total": {"S": string}
}