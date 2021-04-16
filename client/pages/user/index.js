import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut, AmplifySignUp, withAuthenticator } from '@aws-amplify/ui-react';
import Amplify, {Auth} from 'aws-amplify';
import awsExports from '../../src/aws-exports';
import {AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { useEffect, useState } from 'react';
import { setCurrentUser } from '../../redux/user/user.actions';
import {connect, useDispatch, useSelector} from 'react-redux';


const Index = ({setCurrentUser}) => {
  Amplify.configure({ ...awsExports, ssr: true });
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  const name = useSelector((state) => {
    if(currentUser) {
      return state.user.currentUser.attributes.name
    } else {
      return null
    }}
  );


  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setCurrentUser(authData);
    });
  }, []);

  const signOutAuthStateHandler = ((nextAuthState, authData) => {
    console.log({nextAuthState})
    if(nextAuthState === AuthState.SignedOut) {
      console.log('Just signed out!')
      setCurrentUser(null);
    }
  });

  return  currentUser ? (
    <div>
      <h1>Welcome, {name}</h1>
      <div className="w-10">
        <AmplifySignOut handleAuthStateChange={signOutAuthStateHandler}/>
      </div>
    </div>
  ) :
  (
      <div>
        <AmplifyAuthenticator>
          <AmplifySignUp
            slot="sign-up"
            headerText="Sign Up For CoffeeService"
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

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (currentUser) => dispatch(setCurrentUser(currentUser))
})

export default connect(null, mapDispatchToProps)(Index);