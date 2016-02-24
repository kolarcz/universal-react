export const ADD_TODO = 'universal-react/todo/ADD_TODO';
export const DELETE_TODO = 'universal-react/todo/DELETE_TODO';

export default function (state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.text];

    case DELETE_TODO:
      return state.filter((value, index) => (index != action.i));

    default:
      return state;
  }
};

export function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
};

export function deleteTodo(i) {
  return {
    type: DELETE_TODO,
    i
  }
};
