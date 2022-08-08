import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import AuthenticatedRoute from '../authentication/AuthenticatedRoute';
import LoginComponent from '../../components/common/login/LoginComponent.jsx';
import ListTodosComponent from '../../components/todo/list/ListTodosComponent.jsx';
import HeaderComponent from '../../components/common/header/HeaderComponent.jsx'
import FooterComponent from '../../components/common/footer/FooterComponent.jsx'
import LogoutComponent from '../../components/common/logout/LogoutComponent.jsx'
import WelcomeComponent from '../../components/common/welcome/WelcomeComponent.jsx'
import ErrorComponent from '../../components/common/error/ErrorComponent.jsx'
import TodoComponent from '../../components/todo/TodoComponent';

class Todo extends Component {
    render() {
        return (
            <div className="App">
 
                <Router>
                    <HeaderComponent/>
                    <Switch>
                        <Route path="/" exact component={LoginComponent}></Route>
                        <Route path="/login" component={LoginComponent}></Route>
                        <AuthenticatedRoute path="/welcome/:name" component={WelcomeComponent}></AuthenticatedRoute>
                        <AuthenticatedRoute  exact path="/todos/:id" component={TodoComponent}></AuthenticatedRoute>
                        <AuthenticatedRoute path="/todos" component={ListTodosComponent}></AuthenticatedRoute>
                        <AuthenticatedRoute path="/logout" component={LogoutComponent}></AuthenticatedRoute>
                        <Route component={ErrorComponent}></Route>
                    </Switch>
                </Router>
                <FooterComponent/>

            </div>
        )
    }
}

export default Todo;