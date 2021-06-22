import React from 'react';

const CustomButton = React.forwardRef(({ children, ...otherProps }, ref) =>{
  return (
    <button
      className="
      h-12 w-24 md:w-32 md:h-14
      bg-gray-700 rounded shadow-lg
      tracking-tight leading-loose
      text-xs md:text-base text-white
      uppercase font-bold cursor-pointer relative bottom-0
      justify-center px-2 py-2

      transform hover:shadow-2xl btn
      hover:-translate-y-1 active:outline-none active:translate-y-0
      active:shadow-lg focus:outline-none
      "
      {...otherProps}
    >
      {children}
    </button>
  );
});

export default CustomButton;
