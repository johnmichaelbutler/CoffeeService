import Amplify, {Auth} from 'aws-amplify';
import { useEffect } from 'react';
import awsConfig from '../../src/aws-exports';
import {useRouter} from 'next/router';
import {connect} from 'react-redux';
import {setCurrentUser} from '../../redux/user/user.actions';

const SignOut = ({setCurrentUser}) => {
  Amplify.configure({ ...awsConfig, ssr: true});
  const router = useRouter();

  useEffect(() => {
    signOutUser();
  }, []);

  const signOutUser = async () => {
    try {
      await Auth.signOut();
      setCurrentUser(null);
      router.push('/');
    } catch (error) {
      console.log('Error signign out: ', error);
    }
  };

  return (
    <div>Signing Out...</div>
  )

};

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: () => dispatch(setCurrentUser())
})

export default connect(null, mapDispatchToProps)(SignOut);