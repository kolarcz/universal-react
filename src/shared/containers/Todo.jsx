import React, { PropTypes } from 'react';

const Todo = ({ text, done, markTodo, deleteTodo }) => {
  const labelStyle = done ? { color: '#bbb', textDecoration: 'line-through' } : {};

  return (
    <li className="list-group-item">
      <button className="btn btn-danger btn-xs" style={{ float: 'right' }} onClick={deleteTodo}>
        <span className="glyphicon glyphicon-trash"></span>
      </button>
      <label style={{ marginBottom: '0px', fontWeight: 'normal', ...labelStyle }}>
        <input checked={done} type="checkbox" onChange={markTodo} />
        {` ${text}`}
      </label>
    </li>
  );
};

Todo.propTypes = {
  text: PropTypes.string.isRequired,
  done: PropTypes.bool.isRequired,
  markTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired
};

export default Todo;
