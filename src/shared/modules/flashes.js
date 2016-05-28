const ADD = 'universal-react/flashes/ADD';
const DELETE = 'universal-react/flashes/DELETE';


export default function (state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, {
        type: action.data.type,
        message: action.data.message
      }];

    case DELETE:
      return [...state.slice(0, action.i), null, ...state.slice(action.i + 1)];

    default:
      return state;
  }
}


export function add(type, message) {
  return {
    type: ADD,
    data: {
      type,
      message
    }
  };
}

export function del(i) {
  return {
    type: DELETE,
    i
  };
}
