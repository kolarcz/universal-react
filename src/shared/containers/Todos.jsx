import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { addTodo, markTodo, deleteTodo } from '../modules/todos';

import Todo from './Todo';

class Todos extends Component {
  constructor(props) {
    super(props);
    this.addTodo = this.addTodo.bind(this);
  }

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
    const { todos, markTodo, deleteTodo } = this.props;
    return (
      <div>
        <Helmet title="Todo" />
        <h1>Todos</h1>

        <form className="form-horizontal" onSubmit={ this.addTodo }>
          <div className="form-group">
            <div className="col-sm-6">
              <div className="input-group">
                <input ref="text" className="form-control" />
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
                    index={index}
                    todo={todo}
                    markTodo={markTodo}
                    deleteTodo={deleteTodo}
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
