import React, { Component } from 'react';
import moment from  'moment';

class StockList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tickers: [] ,
            alertMessage : ''
        }

        this.deleteTodo = this.deleteTodo.bind(this);
        this.updateTodos = this.updateTodos.bind(this);
        this.addTodoClicked = this.addTodoClicked.bind(this);
    }

    componentDidMount(){
       this.refreshTodos();
    }

    deleteTodo(id){
        let username = AuthenticationService.getLoggedInUserName();
        TodoDataService.deleteTodos(username, id)
        .then(
            response =>{
                this.setState(
                    {alertMessage : `Successfully Deleted todo - ${id}`}
                );
                this.refreshTodos();
            }
        )
    }

    refreshTodos(){
        let user = AuthenticationService.getLoggedInUserName();
        TodoDataService.retrieveAllTodos(user)
        .then( response => {
            this.setState(
                {todos: response.data}
            )
        } );   
    }

    updateTodos(id){
        this.props.history.push(`/todos/${id}`);
    }

    addTodoClicked(){
        this.props.history.push(`/todos/-1`);
    }
 
    render() {
        return (
            <div>
                <h1>Interested Stocks</h1>
                {this.state.alertMessage && <div className="alert alert-success container">{this.state.alertMessage}</div>}
                  
                <div className="container">
                    <table className="table">  
                        <thead> 
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Initial Investment</th> 
                                <th>Investment Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.tickers.map(todo => (
                                    <tr key={ticker.id}>
                                        <td>{ticker.id}</td>
                                        <td>{ticker.description}</td>
                                        <td>{ticker.initialInvestment}</td>
                                        <td>{moment(ticker.initialDate).format('YYYY-MM-DD')}</td>
                                        <td>
                                            <button onClick={() => this.updateTicker(ticker.id)} 
                                               className="btn btn-success">Update</button> &nbsp;
                                            <button onClick={() => this.deleteTicker(ticker.id)} 
                                            className="btn btn-warning" >Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    <div className="row">
                        <button className="btn btn-info" onClick={this.addTickerClicked}>Add</button>
                    </div>    
                </div>

            </div>
        );
    }

}