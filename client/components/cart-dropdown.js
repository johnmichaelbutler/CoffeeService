import React from 'react';
import { connect, useSelector } from 'react-redux';
import CartItem from './cart-item';
import CustomButton from './custom-button';
import { toggleCartHidden } from '../redux/cart/cart.actions';
import Link from 'next/link';

function CartDropdown({ toggleCartHidden }) {
  const cartItems = useSelector((state) => state.cart.cartItems)
  console.log(cartItems);
  return (
    <div className="absolute w-240px h-340px grid border border-black bg-white top-40px right-10px z-10">
      <div className="h-64 w-240px flex flex-col overflow-y-scroll border-b-2">
        {cartItems.length ? (
          cartItems.map((cartItem) => (
            <CartItem key={cartItem.id} item={cartItem} />
          ))
        ) : (
          <span className="text-lg mx-6 my-auto">Your cart is empty</span>
        )}
      </div>
      <div className="flex mx-auto my-auto bg-gray-400">
          <CustomButton onClick={toggleCartHidden}>
            <Link href="/cart">
              <a>GO TO CART</a>
            </Link>
          </CustomButton>
      </div>

    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  toggleCartHidden: () => dispatch(toggleCartHidden()),
});

export default connect(null, mapDispatchToProps)(CartDropdown);
// export default CartDropdown;
