import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import { AuthProvider, useFirebaseAuth } from './contexts/AuthContextFirebase';

import Main from './Main';
import Login from './Login';
import ForgotPass from './ForgotPass';
import Register from './Register';
import Support from './Support';
import Demo from './Demo';
import Dashboard from './Dashboard';
import Chair from './Chair';
import Profile from './Profile';

function App() {
  
  function AuthRoute({ component: Component, ...rest }) {
    const { currentUser } = useFirebaseAuth();

    return (
      <Route
        {...rest}
        render={(props) =>
          currentUser ? ( 
            <Component {...props} />
          ) : ( 
            <Redirect to='/app/login' />
          )
        }
      />
    );
  }

  return (
    <AuthProvider>
      <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/support' component={Support} />
        <Route exact path='/demo' component={Demo} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/login/password-reset' component={ForgotPass} />
        <Route exact path='/register' component={Register} />

        <AuthRoute exact path='/chair' component={Chair} />
        <AuthRoute exact path='/dashboard' component={Dashboard} />
        <AuthRoute exact path='/profile' component={Profile} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
