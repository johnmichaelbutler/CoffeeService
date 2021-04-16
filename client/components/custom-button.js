function CustomButton({ children, ...otherProps }) {
  return (
    <button
      className="bg-gray-700 rounded shadow-md w-10/12
      h-12 tracking-tight leading-loose
      text-base text-white mx-3 my-3
      uppercase font-bold cursor-pointer absolute bottom-0
      justify-center hover:border-gray-400"
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default CustomButton;
