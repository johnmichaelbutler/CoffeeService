import { applyMiddleware, createStore } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './root-reducer';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';


const bindMiddleware = (middleware) => {
  if(process.env.NODE_ENV === 'development') {
    return composeWithDevTools(applyMiddleware(logger, ...middleware));
  };
  return applyMiddleware(...middleware);
};

// Create a makeStore function
const makeStore = (initialState) => {
  let store;
  const isClient = typeof window !== 'undefined';

  if(isClient) {
    const persistConfig = {
      key: 'root', // At what point in our reducer do we want to start storing everything
      storage,
      whitelist: ['cart', 'user', 'order'] // List of reducers we want persisted
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    store = createStore(
      persistedReducer,
      initialState,
      bindMiddleware([])
    );
    store.__PERSISTOR = persistStore(store);
  } else {
    // Server-side
    store = createStore(
      rootReducer,
      initialState,
      bindMiddleware([])
    )
  }
  return store;
}

// export an assembled wrapper
export const wrapper  = createWrapper(makeStore, {debug: true, storeKey: ''});
