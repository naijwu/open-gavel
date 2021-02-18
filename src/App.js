import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';

import Main from './Main';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  
  function AuthRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();

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
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <AuthRoute exact path='/dashboard/' component={Dashboard} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
