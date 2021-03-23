import './App.css';
import React, { useState, useMemo } from 'react'; 
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import Checkout from "./Checkout";
import Main from './Main';
import Login from './Login';
import ForgotPass from './ForgotPass';
import Register from './Register';
import Support from './Support';
import Demo from './Demo';
import Dashboard from './Dashboard';
import Preferences from './Preferences';
import Chair from './Chair';
import Profile from './Profile';

import { AuthProvider, useAuthContext } from './authentication/AuthContext';
import { CommitteeProvider } from './contexts/CommitteeContext';

<<<<<<< Updated upstream
=======
//testing purposes will put in an env
const promise = loadStripe("pk_test_51G6WxqGdNKtofFw2p4pKuxr7ZnME1vOuKp3YoqxfTcfZW344gNLt3oHoloZWWonRHhCaftpSlYCD2UPSRl7ihBqb00trYkfCZL")

>>>>>>> Stashed changes
function App() {
  
  function AuthRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuthContext();
    return (
      <Route
        {...rest}
        render={(props) =>
          (currentUser) ? ( 
            <Component {...props} />
          ) : ( 
            <Redirect to='/login' />
          )
        }
      />
    );
  }
  
  function AuthSecRoute({ component: Component, ...rest }) {
    const { currentUser, getTokenData } = useAuthContext();
    return (
      <Route
        {...rest}
        render={(props) =>
          ((currentUser ? getTokenData().type : '') === 'secretariat') ? ( 
            <Component {...props} />
          ) : ( 
            <Redirect to='/login' />
          )
        }
      />
    );
  }
  
  function AuthStaffRoute({ component: Component, ...rest }) {
    const { currentUser, getTokenData } = useAuthContext();
    return (
      <Route
        {...rest}
        render={(props) =>
          ((currentUser ? getTokenData().type : '') === 'staff') ? ( 
            <Component {...props} />
          ) : ( 
            <Redirect to='/login' />
          )
        }
      />
    );
  }
//find a way to add checkout route for donations...  
 return (
    <AuthProvider>
      <CommitteeProvider>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route exact path='/demo' component={Demo} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/login/password-reset' component={ForgotPass} />
          <Route exact path='/register' component={Register} />
          
          <Route exact path='/donate' component={Checkout}/>
          
          <AuthRoute exact path='/support' component={Support} />

          <AuthStaffRoute exact path='/chair' component={Chair} />
          <AuthStaffRoute exact path='/committee/dashboard' component={Preferences} />

          <AuthSecRoute exact path='/secretariat/dashboard' component={Dashboard} />
          <AuthSecRoute exact path='/secretariat/profile' component={Profile} />
        </Switch>
      </CommitteeProvider>
    </AuthProvider>
  );
}

export default App;
