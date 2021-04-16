import { applyMiddleware, createStore } from 'redux';
import { createWrapper } from 'next-redux-wrapper';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './root-reducer';
import cartReducer from './cart/cart.reducer';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';


const bindMiddleware = (middleware) => {
  if(process.env.NODE_ENV === 'development') {
    return composeWithDevTools(applyMiddleware(logger, ...middleware));
  };
  return applyMiddleware(...middleware);

}

// Create a makeStore function
const makeStore = ({isServer}) => {
  if(isServer) {
    // If it's on server side, create a store
    return createStore(rootReducer, bindMiddleware([]));
  } else {
    // If it's on client side, create a store which will persist
    const persistConfig = {
      key: 'root', // At what point in our reducer do we want to start storing everything
      storage,
      whitelist: ['cart', 'user', 'order'] // List of reducers we want persisted
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer); // Create reducer with existing reducer

    const store = createStore( // Create our store for client side
      persistedReducer,
      bindMiddleware([])
    );

    store.__persistor = persistStore(store);
    return store;
  }
}

// export an assembled wrapper
export const wrapper  = createWrapper(makeStore, {debug: true, storeKey: ''});