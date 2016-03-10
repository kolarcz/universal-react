import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { addTodo, markTodo, deleteTodo } from '../modules/todo';

class Todo extends Component {
  addTodo(e) {
    e.preventDefault();

    const textElem = this.refs.text;
    textElem.focus();
    if (textElem.value.length) {
      this.props.addTodo(textElem.value);
      textElem.value = '';
    }
  }

  render() {
    return (
      <div>
        <Helmet title="Todo" />
        <h2>Todo</h2>

        <form className="uk-form" onSubmit={ (e) => this.addTodo(e) }>
          <input ref="text" />
          <button type="submit" className="uk-button uk-button-primary uk-margin-small-left">
            Add new
          </button>

          <ul className="uk-list uk-list-striped uk-width-1-1 uk-width-medium-1-3">
            {this.props.todo.map((todo, index) => (
              <li key={index} style={todo.done ? {'color': '#bbb', 'text-decoration': 'line-through'} : null}>
                <button className="uk-button uk-button-danger uk-button-mini uk-float-right" onClick={ () => this.props.deleteTodo(index) }>
                  <i className="uk-icon-close"></i>
                </button>
                <input type="checkbox" id={'todo' + index} checked={todo.done} />
                <label className="uk-margin-small-left" htmlFor={'todo' + index} onClick={ () => this.props.markTodo(index) }>
                  {todo.text}
                </label>
              </li>
            ))}
          </ul>
        </form>

      </div>
    );
  }
};

export default connect(state => ({
  todo: state.todo
}), {
  addTodo, markTodo, deleteTodo
})(Todo);
