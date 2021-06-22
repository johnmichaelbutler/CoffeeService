import { useRouter } from 'next/router';
import MENU_ITEMS from '../../../menu_items';
import Link from 'next/link';
import Image from 'next/image';
import CustomButton from '../../../components/custom-button';

export default function Category({category_items}) {
  const router = useRouter();

  const items = category_items.map((item) => {
    return (
      <div key={item.id} className="col-span-1 rounded bg-gray-200 w-full mx-auto h-60">
        <div className="grid grid-cols-2">
          <div className="flex-row text-center pt-4">
            <div className="py-3">
              <h2 className="text-xl md:text-2xl text-blue-900 font-semibold ">{item.name}</h2>
              <p className="text-xl font-semibold my-4">${item.price.toFixed(2)}</p>
              <Link href={`${router.asPath}/${item.id}`} passHref>
                <CustomButton>
                  <a>See More</a>
                </CustomButton>
              </Link>
            </div>
          </div>
          <Image
            src={item.picture}
            width="150"
            height="240"
            layout="intrinsic"
            className="object-cover"
          />
        </div>
      </div>
    )
  });

  return (
    <div className="pt-16 contain">
      <div className="my-5">
        <button type="button" onClick={() => router.back()}><img src="/left-arrow.svg" className='h-10' /></button>
      </div>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {items}
      </div>
    </div>
  )
};


export async function getStaticProps(context) {
  const {category} = context.params;
  const items = MENU_ITEMS.filter(
    (categories) => categories.id === category
  );
  const category_items = items[0].items;
  return {
    props: {
      category_items
    }
  }
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { 'category': 'hot_drinks'}},
      { params: { 'category': 'cold_drinks'}}
    ],
    fallback: true
  }
}