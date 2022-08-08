import React, { Component } from 'react';
import AuthenticationService from '../../authentication/AuthenticationService'
import './LoginComponent.css';

class LoginComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: 'admin',
            password: 'password',
            showSuccessMessage: false,
            hasLoginFailed: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.loginClick = this.loginClick.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    loginClick() {

        // AuthenticationService.executeBasicAuthService(this.state.username, this.state.password).then(
        //     () => {
        //         AuthenticationService.registerSuccessfulLogin(this.state.username, this.state.password);
        //         this.props.history.push(`/welcome/${this.state.username}`);
        //     }
        // ).catch(() => { this.setState({
        //         hasLoginFailed: true,
        //         showSuccessMessage: false
        //     })}
        // )    

        AuthenticationService.executeJwtAuthenticationToken(this.state.username, this.state.password).then(
            (response) => {
                AuthenticationService.registerSuccessfulLoginJwt(this.state.username, response.data.token);
                this.props.history.push(`/welcome/${this.state.username}`);
            }
        ).catch(() => {
            this.setState({
                hasLoginFailed: true,
                showSuccessMessage: false
            })
        }
        )


    }

    // render() {
    //     return (
    //         <div>
    //             <h1>Login</h1>
    //             <div className="container">
    //                 {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}

    //                 User Name: <input type="text" name="username" value={this.state.username} onChange={this.handleChange}></input>
    //                 Password:  <input type="password" name="password" value={this.state.password} onChange={this.handleChange}></input>
    //                 <button className="btn btn-success" onClick={this.loginClick}>Login</button>
    //             </div>

    //         </div>
    //     );
    // }

    render() {
        return (
            <>
                <div className="login-form">

                    {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}

                    <form action='#'>
                        <h2 className="text-center">Log in</h2>
                        <div className="form-group">

                            <input type="text" name="username" className="form-control" value={this.state.username}
                                onChange={this.handleChange}></input>
                        </div>
                        <div className="form-group">
                            <input type="password" name="password" className="form-control" value={this.state.password}
                                onChange={this.handleChange}></input>
                        </div>

                    </form>

                    <div className="form-group">
                        <button className="btn btn-primary btn-block" onClick={this.loginClick}>Login</button>
                    </div>

                </div>
            </>
        );
    }

}


export default LoginComponent;