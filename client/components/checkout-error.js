const CheckoutError = ({setShowError, errorMessage}) => {
  return (
    <div className="z-10 w-40 h-32  -top-40 left-28 absolute rounded px-2 mb-12 border border-black">
      <div className="flex">
        <span className="font-bold text-xl rounded cursor-pointer" onClick={setShowError}>X</span>
      </div>
      <p className="font-bold text-xl text-red-600">{errorMessage}</p>
    </div>
  )
}

export default CheckoutError;