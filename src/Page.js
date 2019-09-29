import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from './components/pages/NotFound';
import Login from './components/pages/Login';
import ForgetPwd from './components/pages/ForgetPwd';
import UpdatePwd from './components/pages/UpdatePwd';
import history from "./history";

import App from './App';

export default () => (
    <Router history={history}>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" push />} />        
            <Route path="/app" component={App} />
            <Route path="/404" component={NotFound} />
            <Route path="/login" component={Login} />
			<Route path="/forgetPwd" component={ForgetPwd} />
			<Route path="/updatePwd" component={UpdatePwd} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)