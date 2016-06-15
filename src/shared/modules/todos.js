const ADD = 'universal-react/todos/ADD';
const MARK = 'universal-react/todos/MARK';
const DELETE = 'universal-react/todos/DELETE';


export default function (state = {}, action) {
  switch (action.type) {
    case ADD:
    case MARK:
      return {
        ...state,
        [action.result.id]: action.result
      };

    case DELETE: {
      const newState = {};
      Object.keys(state).filter(id => (id !== action.result.id)).forEach(id => {
        newState[id] = state[id];
      });
      return newState;
    }

    default:
      return state;
  }
}


export function addRequest(text) {
  return {
    types: [null, ADD, null],
    promise: ({ apiClient }) =>
      apiClient.post('/addTodo', { data: { text } })
  };
}

export function add(id, text, done) {
  return {
    type: ADD,
    result: { id, text, done }
  };
}

export function markRequest(id, done) {
  return {
    types: [null, MARK, null],
    promise: ({ apiClient }) =>
      apiClient.post('/markTodo', { data: { id, done } })
  };
}

export function mark(id, text, done) {
  return {
    type: MARK,
    result: { id, text, done }
  };
}

export function delRequest(id) {
  return {
    types: [null, DELETE, null],
    promise: ({ apiClient }) =>
      apiClient.post('/delTodo', { data: { id } })
  };
}

export function del(id) {
  return {
    type: DELETE,
    result: { id }
  };
}
