import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import HelloWorldService from '../../../api/basic/HelloWorldService'

class WelcomeComponent extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            welcomeMessage : '',
            welcomeMessageBean : '',
            welcomeMessageBeanWithPV:'', 
            errorMessage : ''
        }
        this.retrieveWelcomeMessage = this.retrieveWelcomeMessage.bind(this);
        this.handleSuccessfullResponse = this.handleSuccessfullResponse.bind(this);
        this.handleSuccessfullResponseBean = this.handleSuccessfullResponseBean.bind(this);
        this.retrieveWelcomeMessageBean = this.retrieveWelcomeMessageBean.bind(this);
        this.retrieveWelcomeMessageBeanWithPV = this.retrieveWelcomeMessageBeanWithPV.bind(this);
        this.handleSuccessfullResponseBeanPV = this.handleSuccessfullResponseBeanPV.bind(this);
    }

    render() {
        return (    
            <>
                <h2>Welcome!</h2>
                <div className="container">
                    Welcome {this.props.match.params.name}. You can manage your todos  <Link to="/todos">here</Link> 
                </div>
                <hr/>
                <div className="container">
                    Click here to get a customized welcome message. <br/>
                    {/* <button onClick={this.retrieveWelcomeMessage} 
                      className="btn btn-success">Welcome Message</button> <br/> */}
                    {/* <button onClick={this.retrieveWelcomeMessageBean} 
                      className="btn btn-success">Welcome Message With Bean</button> <br/>   */}
                    <button onClick={this.retrieveWelcomeMessageBeanWithPV} 
                      className="btn btn-success">Welcome Message</button> 
                </div>
                <div className="container">
                    {this.state.welcomeMessage}
                </div>

                <div className="container">
                    {this.state.welcomeMessageBean}
                </div>

                <div className="container">
                    {this.state.welcomeMessageBeanWithPV}
                </div>

                <div className="container">
                    {this.state.errorMessage}
                </div>
                
            </>
        );
    }

    retrieveWelcomeMessage(){
        HelloWorldService.executeHelloWorldService()
        .then(response => this.handleSuccessfullResponse(response))
    }

    retrieveWelcomeMessageBean(){
        HelloWorldService.executeHelloWorldServiceBean()
        .then(response => this.handleSuccessfullResponseBean(response));
    }

    retrieveWelcomeMessageBeanWithPV(){
        HelloWorldService.executeHelloWorldServiceBeanWithPV(this.props.match.params.name)
        .then(response => this.handleSuccessfullResponseBeanPV(response))
        .catch(error => this.hanldeError(error));
    } 

    handleSuccessfullResponse(response){
        this.setState(
            { welcomeMessage: response.data }
        )
    }

    handleSuccessfullResponseBean(response){
        this.setState(
            { welcomeMessageBean: response.data.message }
        )
    }

    handleSuccessfullResponseBeanPV(response){
        this.setState(
            { welcomeMessageBeanWithPV: response.data.message }
        )
    }

    hanldeError(error){
        let errorMessage = '';
        if(error.message)
        errorMessage +=error.message

        if(error.render && error.response.data)
          errorMessage +=error.response.data

        this.setState({errorMessage: errorMessage});
    }

}
export default WelcomeComponent;