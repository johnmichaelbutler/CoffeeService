import  ShoppingIcon  from '../public/shopping-bag.svg';
import { connect } from 'react-redux';
import { toggleCartHidden } from '../redux/cart/cart.actions';
import { selectCartItemsCount } from '../redux/cart/cart.selectors';

function CartIcon({ toggleCartHidden, itemCount }) {
  return (
    <div
      className="w-10 h-10 relative flex items-center justify-center cursor-pointer"
      onClick={toggleCartHidden}
    >
      <ShoppingIcon className="w-6 h-6" />
      <span className="absolute text-xs text-white font-bold top-14px">{itemCount}</span>
    </div>
  );
}

const mapStateToProps = (state) => ({
  itemCount: selectCartItemsCount(state),
});

const mapDispatchToProps = (dispatch) => ({
  toggleCartHidden: () => dispatch(toggleCartHidden()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);