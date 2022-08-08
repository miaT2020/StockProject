import React, { Component } from 'react';
import TodoDataService from '../../../api/todo/TodoDataService';
import AuthenticationService from '../../authentication/AuthenticationService';
import moment from  'moment';

class ListTodosComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: [] ,
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
                <h1>List of Todos</h1>
                {this.state.alertMessage && <div className="alert alert-success container">{this.state.alertMessage}</div>}
                  
                <div className="container">
                    <table className="table">  
                        <thead> 
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Is Completed</th> 
                                <th>Target Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.todos.map(todo => (
                                    <tr key={todo.id}>
                                        <td>{todo.id}</td>
                                        <td>{todo.description}</td>
                                        <td>{todo.isDone.toString()}</td>
                                        <td>{moment(todo.targetDate).format('YYYY-MM-DD')}</td>
                                        <td>
                                            <button onClick={() => this.updateTodos(todo.id)} 
                                               className="btn btn-success">Update</button> &nbsp;
                                            <button onClick={() => this.deleteTodo(todo.id)} 
                                            className="btn btn-warning" >Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    <div className="row">
                        <button className="btn btn-info" onClick={this.addTodoClicked}>Create</button>
                    </div>    
                </div>

            </div>
        );
    }

}


export default ListTodosComponent;