import Link from 'next/link';
import CustomButton from '../../components/custom-button';
import MENU_ITEMS from '../../menu_items';

export default function Menu() {

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
      <div className="mt-10 rounded bg-gray-200 w-full mx-auto h-60">
      <h1 className="py-5 tracking-widest text-center text-4xl">Menu</h1>
        <div className="">
          <ul className="grid grid-rows-2 md:grid-cols-2 gap-5 justify-items-center md:justify-evenly">{categories}</ul>
        </div>
      </div>
    </div>
  )
}