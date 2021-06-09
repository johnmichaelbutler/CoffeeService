import { createSelector} from 'reselect';

const selectOrder = (state) => state.order;

export const selectOrderId = createSelector(
  [selectOrder],
  (order) => order.order_id
);

export const selectActiveOrder = createSelector(
  [selectOrder],
  (order) => order.active_order
)