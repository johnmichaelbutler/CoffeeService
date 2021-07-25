import OrderActionTypes from './order.types';

export const toggleActiveOrder = () => ({
  type: OrderActionTypes.TOGGLE_ACTIVE_ORDER
});

export const updateOrderId = (order_id) => ({
  type: OrderActionTypes.UPDATE_ORDER_ID,
  payload: order_id
})

export const completeOrder = () => ({
  type: OrderActionTypes.COMPLETE_ORDER,
});
