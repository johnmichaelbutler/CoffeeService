import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../hooks/use-request';

const StripeCheckoutButton = ({ price, orderId }) => {
  const priceForStripe = price * 100;
  const publishableKey = 'pk_test_5uyEQjGOKix6ZbELqNtH7vu6003VbAEP1I';

  // const { doRequest } = useRequest({
  //   path: '/api/payments',
  //   method: 'post',
  //   body: {
  //     orderId,
  //   },
  //   onSuccess: () => console.log('Payment successfuly sent'),
  // });

  return (
    <StripeCheckout
      label="Pay Now"
      name="Coffee House"
      billingAddress
      shippingAddress
      image="https://svgshare.com/i/CUz.svg"
      description={`Your total is $${price}`}
      amount={priceForStripe}
      panelLabel="Pay Now"
      token={({ id }) => doRequest({ token: id })}
      stripeKey={publishableKey}
    />
  );
};

export default StripeCheckoutButton;
