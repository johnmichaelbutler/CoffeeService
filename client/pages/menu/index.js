import Link from 'next/link';
import MENU_ITEMS from '../../menu_items';

export default function Menu() {

  const categories = MENU_ITEMS.map((category) => {
    return (
      <li key={category.id}>
      <Link href={`/menu/${category.id}`}>
        <a>{category.title}</a>
      </Link>
      </li>
    )
  })

  return (
    <div>
      <h1>Menu Page</h1>
      <ul>{categories}</ul>
    </div>
  )
}