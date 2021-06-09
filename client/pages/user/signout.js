import Amplify, {Auth} from 'aws-amplify';
import { useEffect } from 'react';
import awsConfig from '../../src/aws-exports';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {setCurrentUser} from '../../redux/user/user.actions';

const SignOut = () => {

  Amplify.configure({ ...awsConfig, ssr: true});

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    signOutUser();
  }, []);

  const signOutUser = async () => {
    try {
      await Auth.signOut();
      dispatch(setCurrentUser(null));
      router.push('/');
    } catch (error) {
      console.log('Error signign out: ', error);
    }
  };

  return (
    <div>Signing Out...</div>
  )

};

export default SignOut;