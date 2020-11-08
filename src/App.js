import React, { useEffect, useRef } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Homepage from './pages/homepage/homepage';
import ShopPage from './pages/shop/shop';
import Header from './components/header/header';
import SingInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up';

import { setCurrentUser } from './redux/user/user.actions';
import './App.css';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';


const App = ({currentUser, setCurrentUser}) => {
  // const [currentUser, setCurrentUser] = useState(null);

  let unsubscribeFromAuth = useRef(null);

  // const { setCurrentUser } = props;

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
        <Route exact path="/signin" render={() => currentUser ? <Redirect to='/' /> : <SingInAndSignUp />} />
      </Switch>
    </div>
  );
};

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
