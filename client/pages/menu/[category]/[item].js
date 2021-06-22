import Image from 'next/image';
import MENU_ITEMS from '../../../menu_items';
import { useDispatch } from 'react-redux';
import {addItem} from '../../../redux/cart/cart.actions';
import CustomButton from '../../../components/custom-button';
import { useRouter } from 'next/router';
// import { wrapper } from '../../../redux/store';

const Item = ({menu_item}) => {

  const {picture, name, price, description} = menu_item[0];
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="contain pt-16">
      <div className="my-5">
        <button type="button" onClick={() => router.back()}><img src="/left-arrow.svg" className='h-8 md:h-10' /></button>
      </div>
      <div className="md:flex  bg-gray-200 rounded my-5">
        <div className="md:h-full md:w-full my-auto">
          <Image
            src={`${picture}`}
            layout="responsive"
            width="200"
            height="280"
            className="object-cover"
          />
        </div>
        <div className=" px-8 py-8">
          <div className="flex-row text-center">
          <h2 className="text-xl md:text-2xl text-blue-900 font-bold">{name}</h2>
          <p>{description}</p>
          <p className="text-xl font-semibold my-4">Price: ${price.toFixed(2)}</p>
          <CustomButton>
            <span onClick={() => dispatch(addItem(menu_item[0]))}>
              Order
            </span>
          </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
};

export async function getStaticProps({params}) {
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
};

// export const getStaticProps = wrapper.getStaticProps(async ({params, store}) => {
//   // console.log(context)
//   // Redux
//   store.dispatch(addItem())
//   // Item Props
//   const {item, category} = params;

//   const category_items = MENU_ITEMS.filter(
//     (categories) => categories.id === category
//   );

//   const menu_item = category_items[0].items.filter(
//     (m_item) => {
//       return (
//         m_item.id == item
//       )
//     }
//   );

//   return {
//     props: {
//       menu_item
//     }
//   }
// });

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

export default Item;