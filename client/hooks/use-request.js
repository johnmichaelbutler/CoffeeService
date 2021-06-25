import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess, currentUser }) => {
  const [errors, setErrors ] = useState(null);
  let doRequest = () => console.log('No User');

  const headers = {
    "Access-Control-Allow-Headers" : "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  };

  if(currentUser) {
    doRequest = async (props = {}) => {
      try {
        const response = await axios[method](url, {...body, ...props, headers });
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