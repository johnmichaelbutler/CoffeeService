import '../styles/globals.css'
import { wrapper } from '../redux/store';
import Navbar from '../components/navbar';
import {useStore} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../src/aws-exports';


function MyApp({ Component, pageProps }) {
  Amplify.configure({
    ...awsconfig,
    ssr: true
  });
  const store = useStore();
  return (
    <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
      <>
        <Navbar />
        <Component {...pageProps} />
      </>
    </PersistGate>
  )
}

export default wrapper.withRedux(MyApp);
