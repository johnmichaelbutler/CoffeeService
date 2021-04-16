import {useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MENU_ITEMS from '../../../menu_items';
import Link from 'next/link';
import MenuItem from '../../../components/menu-item';
import Image from 'next/image';

export default function Category({category_items}) {
  const router = useRouter();

  const items = category_items.map((item) => {
    return(
      <div key={item.id} className="rounded span-col-1 bg-gray-300">
        <div className="flex">
          <div className="flex-row text-center">
            <h2 className="text-xl text-blue-900 ">{item.name}</h2>
            <p>{item.description}</p>
            <p className="">Price: ${item.price.toFixed(2)}</p>
            <Link href={`${router.asPath}/${item.id}`}>
              <a>See More</a>
            </Link>
          </div>
          <Image
            src={item.picture}
            className=""
            width="150"
            height="150"
            layout="intrinsic"
          />
        </div>
      </div>
    )
  });

  return (
    <div className="contain">
      <div>Category:
        <div className="grid grid-cols-2 gap-4">
          {items}
        </div>
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
      { params: { 'category': 'hot_coffee'}},
      { params: { 'category': 'cold_coffee'}}
    ],
    fallback: true
  }
}