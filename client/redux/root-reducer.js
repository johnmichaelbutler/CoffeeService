import { combineReducers } from 'redux';
import cartReducer from './cart/cart.reducer';
import userReducer from './user/user.reducer';
import orderReducer from './order/order.reducer';

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  order: orderReducer
});

export default rootReducer;