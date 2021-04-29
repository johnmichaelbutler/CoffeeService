import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess, currentUser }) => {
  const [errors, setErrors ] = useState(null);
  let doRequest = () => console.log('No User');

  const instance = axios.create({
    baseUrl: 'https://czqzs2siac.execute-api.us-east-2.amazonaws.com/Prod',
    timeout: 1000,
    headers: {
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*"
    }
  });

  const headers = {
    "Access-Control-Allow-Headers" : "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  };



  // console.log({instance})

  if(currentUser) {
    doRequest = async (props = {}) => {
      try {
      //   setErrors(null);
      //   const config = {
      //     url: path,
      //     method: method,
      //     ...body,
      //     ...props
      //   };
      //   const response = await instance(config);
      //   console.log('Response from use-request/doRequest', response);
        const response = await axios[method](url, {...body, headers, ...props});
        console.log('Response from use-request', response);
        if(onSuccess) {
          // onSuccess(response.data);
          onSuccess(response);
        };
        return response.data;
      } catch (error) {
        // setErrors(
        //   <div className="text-red-400">
        //     <h4>Oooops...</h4>
        //     <ul>
        //       {error.response.data.errors.map((err) => {
        //         <li key={err.message}>{err.message}</li>
        //       })}
        //     </ul>
        //   </div>
        // )
        setErrors(error);
        console.log(error);
      }
    }
  }
  return { doRequest, errors };
};

export { useRequest };