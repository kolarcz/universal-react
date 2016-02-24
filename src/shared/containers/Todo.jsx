import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from "react-helmet";

import { addTodo, deleteTodo } from '../modules/todo';

class Todo extends Component {
  addTodo(e) {
    e.preventDefault();

    const textElem = this.refs.text;
    if (textElem.value.length) {
      this.props.addTodo(textElem.value);
      textElem.value = '';
    }
  }

  deleteTodo(e, index) {
    e.preventDefault();
    this.props.deleteTodo(index);
  }

  render() {
    return (
      <div>
        <Helmet title="Todo" />
        <h2>Todo</h2>
        <form onSubmit={(e) => this.addTodo(e)}>
          <input type="text" ref="text" />
          <input type="submit" value="Add" />
        </form>
        <ul>
          {this.props.todo.map((value, index) => (
            <li key={index}>
              <a href="#" onClick={(e) => this.deleteTodo(e, index)} title="Delete">×</a> {value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default connect(state => ({
  todo: state.todo
}), {
  addTodo, deleteTodo
})(Todo);
