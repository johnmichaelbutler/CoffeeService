import { useSelector } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../hooks/use-request';

const StripeCheckoutButton = () => {
  const total = useSelector((state) => state.cart.cartItems.reduce((accumulatedQuantity, cartItem) => accumulatedQuantity + cartItem.price * cartItem.quantity, 0));
  const order_id = useSelector((state) => state.order.order_id);
  const currentUser = useSelector((state) => state.user.currentUser);

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
