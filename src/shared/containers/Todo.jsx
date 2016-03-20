import React, { Component, PropTypes } from 'react';

class Todo extends Component {
  constructor(props) {
    super(props);
    this.markTodo = this.markTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  markTodo() {
    this.props.markTodo(this.props.index);
  }

  deleteTodo(e) {
    e.preventDefault();
    this.props.deleteTodo(this.props.index);
  }

  render() {
    const { todo } = this.props;

    const labelStyle = todo.done ? { color: '#bbb', textDecoration: 'line-through' } : {};
    labelStyle.marginBottom = '0';
    labelStyle.fontWeight = 'normal';

    return (
      <li className="list-group-item">
        <button
          className="btn btn-danger btn-xs"
          style={{ float: 'right' }}
          onClick={this.deleteTodo}
        >
          <span className="glyphicon glyphicon-trash"></span>
        </button>
        <label style={labelStyle}>
          <input checked={todo.done} type="checkbox" onClick={this.markTodo} />
          {` ${todo.text}`}
        </label>
      </li>
    );
  }
}

Todo.propTypes = {
  index: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  markTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired
};

export default Todo;
