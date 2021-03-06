import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import {
  add as addTodo,
  mark as markTodo,
  del as deleteTodo,
  addRequest as addRequestTodo,
  markRequest as markRequestTodo,
  delRequest as deleteRequestTodo,
  setRequest as setRequestTodos
} from '../modules/todos';

import Todo from './Todo';

class Todos extends Component {

  componentDidMount() {
    const { addTodo, markTodo, deleteTodo } = this.props;
    global.socket.on('addTodo', addTodo);
    global.socket.on('markTodo', markTodo);
    global.socket.on('deleteTodo', deleteTodo);
  }

  componentWillUnmount() {
    const { addTodo, markTodo, deleteTodo } = this.props;
    global.socket.off('addTodo', addTodo);
    global.socket.off('markTodo', markTodo);
    global.socket.off('deleteTodo', deleteTodo);
  }

  render() {
    const { todos, addRequestTodo, markRequestTodo, deleteRequestTodo } = this.props;

    const addTodoEvent = (e) => {
      e.preventDefault();

      const textElem = e.target.text;
      textElem.focus();

      if (textElem.value.length) {
        addRequestTodo(textElem.value);
        textElem.value = '';
      }
    };

    const markTodoEvent = (id, completed) => {
      markRequestTodo(id, completed);
    };

    const deleteTodoEvent = (id, e) => {
      e.preventDefault();
      deleteRequestTodo(id);
    };

    return (
      <div>
        <Helmet>
          <title>Todos</title>
        </Helmet>

        <h1>Todos</h1>

        <form className="form-horizontal" onSubmit={addTodoEvent}>
          <div className="form-group">
            <div className="col-sm-6">
              <div className="input-group">
                <input name="text" className="form-control" />
                <span className="input-group-btn">
                  <button className="btn btn-primary" type="submit">
                    <span className="glyphicon glyphicon-plus" /> Add todo
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-6">
              <ul className="list-group">
                {Object.keys(todos).map(id => (
                  <Todo
                    key={id}
                    text={todos[id].text}
                    completed={todos[id].completed}
                    markTodo={() => markTodoEvent(id, !todos[id].completed)}
                    deleteTodo={e => deleteTodoEvent(id, e)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </form>
      </div>
    );
  }

}

Todos.propTypes = {
  todos: PropTypes.object.isRequired,
  addTodo: PropTypes.func.isRequired,
  markTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  addRequestTodo: PropTypes.func.isRequired,
  markRequestTodo: PropTypes.func.isRequired,
  deleteRequestTodo: PropTypes.func.isRequired
};

export default asyncConnect([{
  promise: ({ store: { dispatch } }) =>
    dispatch(setRequestTodos())
}])(connect(state => ({
  todos: state.todos
}), {
  addTodo,
  markTodo,
  deleteTodo,
  addRequestTodo,
  markRequestTodo,
  deleteRequestTodo
})(Todos));
