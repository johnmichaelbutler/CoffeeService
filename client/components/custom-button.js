function CustomButton({ children, ...otherProps }) {
  return (
    <button
      className="bg-gray-700 rounded shadow-md w-32
      h-12 tracking-tight leading-loose
      text-base text-white
      uppercase font-bold cursor-pointer relative bottom-0
      justify-center hover:border-gray-400
      px-2 py-2
      "
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default CustomButton;
