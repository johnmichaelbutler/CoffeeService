import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {selectCartItems} from '../redux/cart/cart.selectors';
import CartItem from './cart-item';
import CustomButton from './custom-button';
import { toggleCartHidden } from '../redux/cart/cart.actions';
import Link from 'next/link';

function CartDropdown() {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

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
      <div className="flex h-5.25rem w-full justify-center items-center align-middle">
          <CustomButton onClick={() => dispatch(toggleCartHidden())} >
            <Link href="/cart">
              <a>CART</a>
            </Link>
          </CustomButton>
      </div>
    </div>
  );
}

export default CartDropdown;
