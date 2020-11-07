import React, { useEffect, useRef } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Homepage from './pages/homepage/homepage';
import ShopPage from './pages/shop/shop';
import Header from './components/header/header';
import SingInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up';
import { setCurrentUser } from './redux/user/user.actions';
import './App.css';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';


const App = (props) => {
  // const [currentUser, setCurrentUser] = useState(null);

  let unsubscribeFromAuth = useRef(null);

  const { setCurrentUser } = props;

  useEffect (() => {
    unsubscribeFromAuth.current = auth.onAuthStateChanged(async userAuth => {

      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          })
        })
      } else {
        setCurrentUser(userAuth);
      }

      return unsubscribeFromAuth;
    })
  }, [setCurrentUser]);

  // useEffect (() => {
  //   console.log(currentUser);
  // }, [currentUser])

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/signin" component={SingInAndSignUp} />
      </Switch>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});


export default connect(null, mapDispatchToProps)(App);
