import { useDispatch } from 'react-redux';
import Image from 'next/image';
import {
  clearItemFromCart,
  addItem,
  removeItem,
} from '../redux/cart/cart.actions';

function CheckoutItem({ cartItem }) {

  const { name, picture, price, quantity } = cartItem;
  const dispatch = useDispatch();

  return (
    <div className="w-full flex min-h-100px border-b-2 border-gray-300 py-2 font-light items-center justify-center">
      <div className="w-1/4">
        <Image
          src={picture}
          alt="item"
          layout="fixed"
          className="object-cover"
          height="100"
          width="100"
        />
      </div>
      <div className="w-1/4">{name}</div>
      <div className="w-1/4">
        <span className="cursor-pointer" onClick={() => dispatch(removeItem(cartItem))}>
          &#10094;
        </span>
        <span className="mx-3 my-3">{quantity}</span>
        <span className="cursor-pointer" onClick={() => dispatch(addItem(cartItem))}>
          &#10095;
        </span>
      </div>
      <span className="w-1/4">${price.toFixed(2)}</span>
      <div className="pl-3 cursor-pointer w-1/4" onClick={() => dispatch(clearItemFromCart(cartItem))}>
        &#10005;
      </div>
    </div>
  );
}

export default CheckoutItem;