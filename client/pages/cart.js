import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CheckoutItem from '../components/checkout-item';
import { useRequest } from '../hooks/use-request';
import CheckoutError from '../components/checkout-error';
import Link from 'next/link';
import {useRouter} from 'next/router';

function CartPage() {
  const [orderId, setOrderId] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentUser = useSelector((state) => state.user.currentUser);

  const name = useSelector((state) => currentUser ? state.user.currentUser.attributes.name : null);
  const username = useSelector((state) => currentUser ? state.user.currentUser.username : null);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const total = useSelector((state) => state.cart.cartItems.reduce((accumulatedQuantity, cartItem) => accumulatedQuantity + cartItem.price * cartItem.quantity, 0));

  const router = useRouter();

  const items = cartItems.map((cartItem) => {
    return {
      item: cartItem.name,
      quantity: cartItem.quantity,
    };
  });

  let { doRequest } = useRequest({
    path: '/',
    method: 'post',
    body: {
      items,
      userId: username,
      name: name,
      total,
    },
    onSuccess: (res) => {
      console.log(res);
      setOrderId(res.id);
    },
    currentUser
  });

  useEffect(() => {
    return () => {
      setShowError(false);
    }
  }, [])


  const createOrder = async () => {
    if(total <= 0) {
      setErrorMessage('Please add items to check out');
      setShowError(true);
      return;
    }
    if(!currentUser) {
      setErrorMessage('Please sign in to check out');
      setShowError(true);
      return;
    }
    else {
      console.log('Creating order');
      try {
        const res = await doRequest();
        console.log(res);
        router.push('/checkout');
      } catch (error) {
        console.log('Error sending request', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-3/4 min-h-full mt-12 mx-auto mb-0">
      <div className="w-full flex justify-between border-b-b-1 border-gray-700 py-3 px-0">
        <div className="capitalize w-1/4">
          <span>Product</span>
        </div>
        <div className="capitalize w-1/4">
          <span>Description</span>
        </div>
        <div className="capitalize w-1/4">
          <span>Quantity</span>
        </div>
        <div className="capitalize w-1/4">
          <span>Price</span>
        </div>
        <div className="capitalize w-1/4">
          <span>Remove</span>
        </div>
      </div>
      {cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}
      <div className="mt-8 ml-auto text-3xl">TOTAL: ${total.toFixed(2)}</div>
      <div className="relative">
        {showError ? <CheckoutError errorMessage={errorMessage} setShowError={() => setShowError(false)} /> : null }
        <a className="bg-gray-300 rounded w-auto h-auto py-1 px-1" onClick={createOrder}>
          Checkout
        </a>
      </div>
    </div>
  );
}

export default CartPage;