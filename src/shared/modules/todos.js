const ADD = 'universal-react/todos/ADD';
const MARK = 'universal-react/todos/MARK';
const DELETE = 'universal-react/todos/DELETE';


export default function (state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, {
        text: action.text,
        done: false
      }];

    case MARK:
      return state.map((todo, index) => {
        if (index === action.i) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });

    case DELETE:
      return state.filter((todo, index) => (index !== action.i));

    default:
      return state;
  }
}


export function add(text) {
  return {
    type: ADD,
    text
  };
}

export function mark(i) {
  return {
    type: MARK,
    i
  };
}

export function del(i) {
  return {
    type: DELETE,
    i
  };
}
