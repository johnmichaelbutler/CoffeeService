import { useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../hooks/use-request';
import {selectCartTotal} from '../redux/cart/cart.selectors';
import {selectCurrentUser} from '../redux/user/user.selector';
import {selectOrderId} from '../redux/order/order.selectors';

const StripeCheckoutButton = () => {
  const total = useSelector(selectCartTotal);
  const order_id = useSelector(selectOrderId);
  const currentUser = useSelector(selectCurrentUser);

  const totalForStripe = total * 100;
  const publishableKey = 'pk_test_5uyEQjGOKix6ZbELqNtH7vu6003VbAEP1I';

  const { doRequest } = useRequest({
    path: 'https://hnr395j1l6.execute-api.us-east-2.amazonaws.com/Dev/payments',
    method: 'post',
    body: {
      order_id,
      totalForStripe,
      currentUser
    },
    currentUser,
    onSuccess: () => console.log('Payment successfuly sent'),
  });


  return (

    <StripeCheckout
      label="Pay Now"
      name="CoffeeService"
      billingAddress
      allowRememberMe
      image="https://svgshare.com/i/CUz.svg"
      description={`Your total is $${total}`}
      amount={totalForStripe}
      panelLabel="Pay Now"
      token={({ id }) => doRequest({ token: id })}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
