import Link from 'next/link';
import { useRouter } from 'next/router';
import CustomButton from '../../components/custom-button';
import MENU_ITEMS from '../../menu_items';

export default function Menu() {

  const router = useRouter();

  const categories = MENU_ITEMS.map((category) => {
    return (
      <li key={category.id}>
        <Link href={`/menu/${category.id}`} passHref>
          <CustomButton>
            <a>{category.title}</a>
          </CustomButton>
        </Link>
      </li>
    )
  })

  return (
    <div className="pt-16 contain">
      {/* <div className="my-5">
        <button type="button" onClick={() => router.back()}><img src="/left-arrow.svg" className='h-10' /></button>
      </div> */}
      <div className="mt-10 rounded bg-gray-200 w-full mx-auto h-60">
      <h1 className="py-5 tracking-widest text-center text-4xl">Menu</h1>
        <div className="">
          <ul className="flex justify-evenly">{categories}</ul>
        </div>
      </div>
    </div>
  )
}