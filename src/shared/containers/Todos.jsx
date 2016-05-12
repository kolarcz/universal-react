import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { addTodo, markTodo, deleteTodo } from '../modules/todos';

import Todo from './Todo';

const Todos = ({ todos, addTodo, markTodo, deleteTodo }) => {
  const addTodoEvent = (e) => {
    e.preventDefault();

    const textElem = e.target.text;
    textElem.focus();

    if (textElem.value.length) {
      addTodo(textElem.value);
      textElem.value = '';
    }
  };

  const markTodoEvent = (index) => {
    markTodo(index);
  };

  const deleteTodoEvent = (index, e) => {
    e.preventDefault();
    deleteTodo(index);
  };

  return (
    <div>
      <Helmet title="Todo" />
      <h1>Todos</h1>

      <form className="form-horizontal" onSubmit={addTodoEvent}>
        <div className="form-group">
          <div className="col-sm-6">
            <div className="input-group">
              <input name="text" className="form-control" />
              <span className="input-group-btn">
                <button className="btn btn-primary" type="submit">
                  <span className="glyphicon glyphicon-plus"></span> Add todo
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-6">
            <ul className="list-group">
              {todos.map((todo, index) => (
                <Todo
                  key={index}
                  text={todo.text}
                  done={todo.done}
                  markTodo={() => markTodoEvent(index)}
                  deleteTodo={(e) => deleteTodoEvent(index, e)}
                />
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

Todos.propTypes = {
  todos: PropTypes.array.isRequired,
  addTodo: PropTypes.func.isRequired,
  markTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired
};

export default connect(state => ({
  todos: state.todos
}), {
  addTodo, markTodo, deleteTodo
})(Todos);
