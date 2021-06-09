import { connect } from 'react-redux';
import Image from 'next/image';
import {
  clearItemFromCart,
  addItem,
  removeItem,
} from '../redux/cart/cart.actions';

function CheckoutItem({ cartItem, clearItem, addItem, removeItem }) {
  const { name, picture, price, quantity } = cartItem;
  return (
    <div className="w-full flex min-h-100px border-b-1 border-gray-800 px-4 py-0 text-lg items-center justify-center">
      <div className="w-1/4">
        <Image
          src={picture}
          alt="item"
          layout="fixed"
          className="object-cover"
          height="100"
          width="100"
        />
        {/* <img src={picture} alt="item" /> */}
      </div>
      <div className="w-1/4">{name}</div>
      <div className="w-1/4">
        <span className="cursor-pointer" onClick={() => removeItem(cartItem)}>
          &#10094;
        </span>
        <span className="mx-3 my-3">{quantity}</span>
        <span className="cursor-pointer" onClick={() => addItem(cartItem)}>
          &#10095;
        </span>
      </div>
      <span className="w-1/4">${price.toFixed(2)}</span>
      <div className="pl-3 cursor-pointer w-1/4" onClick={() => clearItem(cartItem)}>
        &#10005;
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  clearItem: (cartItem) => dispatch(clearItemFromCart(cartItem)),
  addItem: (item) => dispatch(addItem(item)),
  removeItem: (item) => dispatch(removeItem(item)),
});

export default connect(null, mapDispatchToProps)(CheckoutItem);
