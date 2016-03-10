export const ADD_TODO = 'universal-react/todo/ADD_TODO';
export const MARK_TODO = 'universal-react/todo/MARK_TODO';
export const DELETE_TODO = 'universal-react/todo/DELETE_TODO';


export default function (state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, {
        text: action.text,
        done: false
      }];

    case MARK_TODO:
      return state.map((todo, index) => {
        if (index == action.i) {
          todo.done = !todo.done;
        }
        return todo;
      });

    case DELETE_TODO:
      return state.filter((todo, index) => (index != action.i));

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

export function markTodo(i) {
  return {
    type: MARK_TODO,
    i
  }
}

export function deleteTodo(i) {
  return {
    type: DELETE_TODO,
    i
  }
};
