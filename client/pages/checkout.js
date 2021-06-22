import {useEffect} from 'react';
import StripeCheckoutButton from '../components/stripe-button';
import { useSelector } from 'react-redux';
import {selectCurrentUser} from '../redux/user/user.selector';
import { useRouter } from 'next/router';

function CheckoutPage() {
  const currentUser = useSelector(selectCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if(!currentUser) {
      router.push('/');
    };
  }, [])


  return (
    <div className="fixed pt-16">
      <div className="top-3">
        <p className="text-center mt-10 text-2xl text-red-600">
          *Please use the following test credit card for payment*
          <br />
          4242 4242 4242 4242 - Exp: 01/22 - CVV: 123
        </p>
        <StripeCheckoutButton />
      </div>
    </div>
  );
};

export default CheckoutPage;
