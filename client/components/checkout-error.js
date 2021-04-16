const CheckoutError = ({setShowError, errorMessage}) => {
  return (
    <div className="z-10 w-40 h-40 bg-gray-400">
      <span className="rounded mx-1 my-1 bg-gray-200" onClick={setShowError}>X</span>
      <p>{errorMessage}</p>
    </div>
  )
}

export default CheckoutError;