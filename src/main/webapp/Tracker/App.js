import React, { Component } from 'react';
import Todo from './components/routing/TodoApp';
import './bootstrap.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
         <Todo></Todo>
      </div>
    );
  }
}

export default App;
