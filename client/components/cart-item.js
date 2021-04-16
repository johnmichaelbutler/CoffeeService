function CartItem({ item: { picture, price, name, quantity } }) {
  return (
    <div className="w-full flex h-20 mb-4">
      <img className="w-1/3" src={picture} alt="item" />
      <div className="w-2/3 flex flex-col items-start justify-center px-3 py-5">
        <span className="text-base">{name}</span>
        <span className="">
          {quantity} x ${price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CartItem;
