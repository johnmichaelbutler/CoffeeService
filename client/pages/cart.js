import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutItem from '../components/checkout-item';
import { useRequest } from '../hooks/use-request';
import CheckoutError from '../components/checkout-error';
import CustomButton from '../components/custom-button'
import {useRouter} from 'next/router';
import {selectCurrentUser} from '../redux/user/user.selector';
import {selectOrderId} from '../redux/order/order.selectors';
import {selectCartItems, selectCartTotal} from '../redux/cart/cart.selectors';
import {updateOrderId} from '../redux/order/order.actions';

function CartPage() {
  // Used in case of error
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redux Dispatch
  const dispatch = useDispatch();

  // Redux Selectors
  const currentUser = useSelector(selectCurrentUser);
  const orderId = useSelector(selectOrderId);
  const name = currentUser ? currentUser.attributes.name : null;
  const username = currentUser ? currentUser.username : null;
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);


  const router = useRouter();

  const items = cartItems.map((cartItem) => {
    return {
      item: cartItem.name,
      quantity: cartItem.quantity,
    };
  });

  let { doRequest, errors } = useRequest({
    url: 'https://a2zlteclg0.execute-api.us-east-2.amazonaws.com/Dev/',
    method: 'post',
    body: {
      items,
      userId: username,
      name: name,
      total,
    },
    onSuccess: (res) => {
      console.log('Running on success', res);
      const order_id = res.data.order_id.S;
      dispatch(updateOrderId(order_id));
    },
    currentUser
  });

  console.log('Errors from useRequest', errors);

  useEffect(() => {
    if(errors) {
      setShowError(true);
    };
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
        if(!errors) {
          console.log('Order created', res);
          router.push('/checkout');
        } else {
          console.log('Order not created', res);
        }
        // router.push('/checkout');
      } catch (error) {
        console.log('Error sending request', error);
      }
    }
  };

  return (
    <div className="pt-16 flex flex-col items-center w-3/4 min-h-full mt-12 mx-auto mb-0 text-center">
      <div className="w-full flex justify-between border-b-b-1 border-gray-700 py-3 px-0 text-center">
        <div className="capitalize w-1/4">
          <span className="font-medium text-lg underline">Product</span>
        </div>
        <div className="capitalize w-1/4">
          <span className="font-medium text-lg underline">Description</span>
        </div>
        <div className="capitalize w-1/4">
          <span className="font-medium text-lg underline">Quantity</span>
        </div>
        <div className="capitalize w-1/4">
          <span className="font-medium text-lg underline">Price</span>
        </div>
        <div className="capitalize w-1/4">
          <span className="font-medium text-lg underline">Remove</span>
        </div>
      </div>
      {cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}
      <div className="pb-20">
        <div className="text-3xl mt-8 ">
          TOTAL: ${total.toFixed(2)}
        </div>
        <div className="mt-4">
          <CustomButton onClick={createOrder} >
            <a>Checkout</a>
          </CustomButton>
        </div>
      </div>
      <div className="relative">
        {showError ?
          <CheckoutError errorMessage={errorMessage} setShowError={() => setShowError(false)} />
          :
          null
        }
      </div>
    </div>
  );
}

export default CartPage;
