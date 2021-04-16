import {HYDRATE} from 'next-redux-wrapper';
import OrderActionTypes from './order.types';

const INITIAL_STATE = {
  order_id: null,
  active_order: null
};

const orderReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case HYDRATE:
      const nextState = {
        ...state,
        ...action.payload
      };
      if(state.order_id) {
        nextState.order_id = state.order_id
      }
      return nextState;
    case OrderActionTypes.UPDATE_ORDER_ID:
      return {
        ...state,
        order_id: action.payload
      };
    case OrderActionTypes.TOGGLE_ACTIVE_ORDER:
      return {
        ...state,
        active_order: !state.active_order
      }
    default:
      return state;
  }
}

export default orderReducer;