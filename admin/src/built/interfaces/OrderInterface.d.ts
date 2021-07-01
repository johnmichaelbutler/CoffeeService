import OrderStatus from '../enums/OrderStatusEnum';
export interface Order {
    order_id: {
        S: string;
    };
    name: {
        S: string;
    };
    status: {
        S: OrderStatus;
    };
    user_id: {
        S: string;
    };
    items: {
        L: Array<object>;
    };
}
