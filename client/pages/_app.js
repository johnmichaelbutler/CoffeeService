import '../styles/globals.css'
import { wrapper } from '../redux/store';
import {Provider, useStore} from 'react-redux';
import withRedux from 'next-redux-wrapper';
import Layout from './layout/layout';
import reduxStore from '../redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import Amplify from 'aws-amplify';
import awsconfig from '../src/aws-exports';

import store from '../redux/store';

function MyApp({ Component, pageProps }) {
  Amplify.configure({
    ...awsconfig,
    ssr: true
  });

  return (
    <Provider store={store}>
      {/* <PersistGate persistor={store.__PERSISTOR} loading={<div>Loading</div>}> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      {/* </PersistGate> */}
    </Provider>
  )
};

export default MyApp;


// export default wrapper.withRedux(MyApp);
