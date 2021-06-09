import Image from 'next/image';
import MENU_ITEMS from '../../../menu_items';
import { connect, useSelector } from 'react-redux';
import {addItem} from '../../../redux/cart/cart.actions';
import { wrapper } from '../../../redux/store';


const Item = ({menu_item, addItem}) => {
  console.log({menu_item});
  const {id, short_name, picture, name, price, description} = menu_item[0];

  return (
    <div className="contain pt-16">
      <div className="flex  bg-gray-200 rounded">
        <div className=" ">
          <div className="flex-row text-center">
          <h2 className="text-xl text-blue-900">{name}</h2>
          <p>{description}</p>
          <p>Price: ${price.toFixed(2)}</p>
          <button className="bg-gray-500 rounded px-2 py-2 hover:bg-gray-400" onClick={() => addItem(menu_item[0])}>
            Add To Cart
          </button>
          </div>
        </div>
        <div className="flex">
          <Image
            src={`${picture}`}
            layout="intrinsic"
            width="150"
            height="150"
          />
        </div>
      </div>
    </div>
  )
};

export const mapDispatchToProps = (dispatch) => {
  return {
    addItem: item => dispatch(addItem(item))
  }
}

export const getStaticProps = wrapper.getStaticProps(async ({params, store}) => {
  // console.log(context)
  // Redux
  store.dispatch(addItem())
  // Item Props
  const {item, category} = params;

  const category_items = MENU_ITEMS.filter(
    (categories) => categories.id === category
  );

  const menu_item = category_items[0].items.filter(
    (m_item) => {
      return (
        m_item.id == item
      )
    }
  );

  return {
    props: {
      menu_item
    }
  }
});

export async function getStaticPaths() {
  return {
    paths: [
      { params: { 'category': 'hot_coffee', 'item': 'coffee'}},
      { params: { 'category': 'hot_coffee', 'item': 'espresso'}},
      { params: { 'category': 'hot_coffee', 'item': 'latte'}},
      { params: { 'category': 'hot_coffee', 'item': 'cappuccino'}},
      { params: { 'category': 'hot_coffee', 'item': 'pour_over'}},
      { params: { 'category': 'cold_coffee', 'item': 'cold_brew'}},
      { params: { 'category': 'cold_coffee', 'item': 'iced_coffee'}},
    ],
    fallback: true
  }
};

export default connect(null, mapDispatchToProps)(Item);