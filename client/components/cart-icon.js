import  ShoppingIcon  from '../public/shopping-bag.svg';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCartHidden } from '../redux/cart/cart.actions';
import { selectCartItemsCount } from '../redux/cart/cart.selectors';

function CartIcon() {
  const dispatch = useDispatch();;
  const itemCount = useSelector(selectCartItemsCount);

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