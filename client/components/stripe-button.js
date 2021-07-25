import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../hooks/use-request';
import {selectCartTotal} from '../redux/cart/cart.selectors';
import {selectCurrentUser} from '../redux/user/user.selector';
import {selectOrderId} from '../redux/order/order.selectors';
import axios from 'axios';
import { clearCart } from '../redux/cart/cart.actions';
import { completeOrder } from '../redux/order/order.actions';

const StripeCheckoutButton = () => {
  const total = useSelector(selectCartTotal);
  const order_id = useSelector(selectOrderId);
  const currentUser = useSelector(selectCurrentUser);

  const totalForStripe = total * 100;
  const publishableKey = 'pk_test_5uyEQjGOKix6ZbELqNtH7vu6003VbAEP1I';

  const dispatch = useDispatch();

    const {doRequest} = useRequest({
      url: 'https://hnr395j1l6.execute-api.us-east-2.amazonaws.com/Dev/payments',
      method: 'post',
      body: {
        order_id,
        totalForStripe,
        currentUser: currentUser.username
      },
      headers,
      onSuccess: () => {
        console.log('Payment successfuly sent')
        resetReduxState();
        // TODO: REDIRECT TO HOME PAGE AND CREATE A LITTLE POPUP SAYING ORDER COMPLETED
      },
      currentUser
    });


    const headers = {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    };


    const resetReduxState = async () => {
      dispatch(clearCart());
      dispatch(completeOrder());
    }


  return (

    <StripeCheckout
      label="Pay Now"
      name="CoffeeService"
      billingAddress
      allowRememberMe
      image="https://svgshare.com/i/CUz.svg"
      description={`Your total is $${total.toFixed(2)}`}
      amount={totalForStripe}
      panelLabel="Pay Now"
      // token={({id}) => makePost({token: id})}
      token={({ id }) => doRequest({ token: id })}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
