/*
This file holds our selectors, which is used to memoize our data to prevent re-renders. The selector will trigger
a re-render only if there is a chance in the value of the items in our state.

We will use our memoized selector in our mapStateToProps in place of our regular function call
*/
import { createSelector } from 'reselect';

// This is an input selector, where we choose from our state which piece of state we want. We take this input selector and...
const selectCart = (state) => state.cart;

/*
Get the exact piece of state we want using the createSelector, which takes two arguments. The first is an array of
the input selectors we want to use. The second is a function which returns the values we want to get from each input selector
*/
export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.cartItems
);

export const selectCartHidden = createSelector(
  [selectCart],
  (cart) => cart.hidden
);

export const selectCheckoutHidden = createSelector(
  [selectCart],
  (cart) => cart.checkoutHidden
);

/*
The first argument doesn't have to be an input selector, but it can be a memoized selector also, like selectCartItems
*/
export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.reduce(
      (accumulatedQuantity, cartItem) =>
        accumulatedQuantity + cartItem.quantity,
      0
    )
);

export const selectCartTotal = createSelector([selectCartItems], (cartItems) =>
  cartItems.reduce(
    (accumulatedQuantity, cartItem) =>
      accumulatedQuantity + cartItem.price * cartItem.quantity,
    0
  )
);
