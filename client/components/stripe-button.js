import {useEffect} from 'react';
import { useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../hooks/use-request';
import {selectCartTotal} from '../redux/cart/cart.selectors';
import {selectCurrentUser} from '../redux/user/user.selector';
import {selectOrderId} from '../redux/order/order.selectors';
import axios from 'axios';

const StripeCheckoutButton = () => {
  const total = useSelector(selectCartTotal);
  const order_id = useSelector(selectOrderId);
  const currentUser = useSelector(selectCurrentUser);

  const totalForStripe = total * 100;
  const publishableKey = 'pk_test_5uyEQjGOKix6ZbELqNtH7vu6003VbAEP1I';

    // const {doRequest} = useRequest({
    //   path: 'https://hnr395j1l6.execute-api.us-east-2.amazonaws.com/Dev/payments',
    //   method: 'post',
    //   body: {
    //     order_id,
    //     totalForStripe,
    //     currentUser
    //   },
    //   onSuccess: () => console.log('Payment successfuly sent'),
    //   currentUser
    // });


      const headers = {
    "Access-Control-Allow-Headers" : "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  };

    const makePost = async () => {
      let response = await axios.post(
        'https://hnr395j1l6.execute-api.us-east-2.amazonaws.com/Dev/payments',
        {
          order_id,
          totalForStripe,
          currentUser
        },
        headers


      );
      console.log('Response', response);
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
      token={() => makePost()}
      // token={({ id }) => doRequest({ token: id })}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
