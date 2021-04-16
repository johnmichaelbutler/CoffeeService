import { useEffect } from 'react';
import StripeCheckoutButton from '../components/stripe-button';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';

function CheckoutPage({ total, orderId }) {
  const currentUser= useSelector((state) => state.user.currentUser);
  const router = useRouter();

  if(!currentUser) {
    router.push('/');
  };
  
  return (
    <div className="fixed">
      <div className="top-3">
        <p className="text-center mt-10 text-2xl text-red-600">
          *Please use the following test credit card for payment*
          <br />
          4242 4242 4242 4242 - Exp: 01/22 - CVV: 123
        </p>
        <StripeCheckoutButton price={total} orderId={orderId} />
      </div>
    </div>
  );
};

export default CheckoutPage;
