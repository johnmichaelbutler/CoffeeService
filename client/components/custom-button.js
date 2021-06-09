import React from 'react';

const CustomButton = React.forwardRef(({ children, ...otherProps }, ref) =>{
  return (
    <button
      className="
      bg-gray-700 rounded shadow-lg w-32
      h-12 tracking-tight leading-loose
      text-base text-white
      uppercase font-bold cursor-pointer relative bottom-0
      justify-center px-2 py-2
      "
      {...otherProps}
    >
      {children}
    </button>
  );
});

export default CustomButton;
