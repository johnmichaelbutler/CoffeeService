import {randomBytes } from 'crypto';

const makeOrderId = () => {
  return randomBytes(8).toString('hex');
};

export default makeOrderId;