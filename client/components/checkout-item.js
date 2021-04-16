import { connect } from 'react-redux';
import {
  clearItemFromCart,
  addItem,
  removeItem,
} from '../redux/cart/cart.actions';

function CheckoutItem({ cartItem, clearItem, addItem, removeItem }) {
  const { name, picture, price, quantity } = cartItem;
  return (
    <div className="w-full flex min-h-100px border-b-1 border-gray-800 px-4 py-0 text-lg items-center">
      <div className="w-1/4">
        <img src={picture} alt="item" />
      </div>
      <span className="w-1/4">{name}</span>
      <span className="w-1/2">
        <div className="cursor-pointer" onClick={() => removeItem(cartItem)}>
          &#10094;
        </div>
        <span className="mx-0 my-3">{quantity}</span>
        <div className="cursor-pointer" onClick={() => addItem(cartItem)}>
          &#10095;
        </div>
      </span>
      <span className="w-1/4">${price.toFixed(2)}</span>
      <div className="pl-3 cursor-pointer" onClick={() => clearItem(cartItem)}>
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
