import UserActionTypes from './user.types';
import { HYDRATE } from 'next-redux-wrapper';

const INITIAL_STATE = {
  currentUser: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload};
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case UserActionTypes.SET_AUTH_STATE:
      return {
        ...state,
        authState: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
