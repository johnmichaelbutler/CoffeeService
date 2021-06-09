import { AmplifyAuthenticator, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
import awsExports from '../../src/aws-exports';
import {AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { useEffect } from 'react';
import { setCurrentUser } from '../../redux/user/user.actions';
import {useDispatch, useSelector} from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selector';


const Index = () => {
  Amplify.configure({ ...awsExports, ssr: true });

  const currentUser = useSelector(selectCurrentUser);
  const name = currentUser ? currentUser.attributes.name : null;
  const dispatch = useDispatch();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      dispatch(setCurrentUser(authData));
    });
  }, []);

  const signOutAuthStateHandler = ((nextAuthState, authData) => {
    console.log({nextAuthState})
    if(nextAuthState === AuthState.SignedOut) {
      console.log('Just signed out!')
      dispatch(setCurrentUser(null));
    }
  });

  return  currentUser ?
  (
    <div className="pt-16">
      <div className="grid justify-center mt-10 gap-3">
        <h1 className="font-semibold text-lg">Welcome, {name}</h1>
        <div className="w-10 ml-5">
          <AmplifySignOut handleAuthStateChange={signOutAuthStateHandler}/>
        </div>
      </div>
    </div>
  ) :
  (
    <div className="">
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          headerText="Sign Up For Coffee Service"
          usernameAlias="email"
          formFields={[
            {
              type: "name",
              label: "Please Enter Your Name",
              placeholder: "John Smith",
              required: true
            },
            {
              type: "email",
              label: "Please Enter Your Email",
              placeholder: "example@example.com",
              required: true
            },
            {
              type: "password",
              label: "Please Enter a Password",
              placeholder: "******",
              required: true
            },
            {
              type: "phone_number",
              label: "Please Enter a Phone Number",
              placeholder: "555 555 5555",
              required: true
            },
          ]}
        />
      </AmplifyAuthenticator>
    </div>
  )
};

export default Index;