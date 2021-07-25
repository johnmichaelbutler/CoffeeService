import UserActionTypes from './user.types';

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const setAuthState = (authState) => ({
  type: UserActionTypes.SET_AUTH_STATE,
  payload: authState
});
