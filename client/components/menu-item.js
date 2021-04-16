import Link from 'next/link';
export default function MenuItem(item) {
  const {id, name, description, picture, price} = item;
  return (
    <div key={id}>
      <div className="flex">
        <div className="flex-row text-center">
          <h2 className="text-xl text-blue-900 ">{name}</h2>
          <p>{description}</p>
          <p className="">Price: ${price}</p>
          {/* <Link href={`/menu/${id}`}>
            <button className="w-1/4 bg-blue-400 rounded">Order</button>
          </Link> */}
        </div>
        {/* <img
          src={picture}
          alt={name}
          className="w-1/2 rounded justify-center mx-auto row-span-1 my-auto"
        /> */}
      </div>
    </div>
  )
};
