import  ShoppingIcon  from '../public/shopping-bag.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCartHidden } from '../redux/cart/cart.actions';

function CartIcon() {
  const dispatch = useDispatch();;
  const itemCount = useSelector((state) => state.cart.cartItems.reduce((accumulatedQuantity, cartItem) => accumulatedQuantity + cartItem.quantity, 0));

  return (
    <div
      className="w-10 h-10 relative flex items-center justify-center cursor-pointer"
      onClick={() => dispatch(toggleCartHidden())}
    >
      <ShoppingIcon className="w-6 h-6" />
      <span className="absolute text-xs text-white font-bold top-14px">{itemCount}</span>
    </div>
  );
}

export default CartIcon;