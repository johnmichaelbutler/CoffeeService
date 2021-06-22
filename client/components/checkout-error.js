const CheckoutError = ({setShowError, errorMessage}) => {
  return (
    <div className="grid grid-cols-3 z-10 w-48 h-28  -top-40 left-20 absolute rounded px-2 mb-12">
      <div className="col-span-1">
        <div className="font-bold text-2xl rounded cursor-pointer justify-center content-center" onClick={setShowError}>X</div>
      </div>
      <p className="col-span-2 font-bold text-xl text-red-600">{errorMessage}</p>
    </div>
  )
}

export default CheckoutError;