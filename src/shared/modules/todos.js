const ADD = 'universal-react/todos/ADD';
const MARK = 'universal-react/todos/MARK';
const DELETE = 'universal-react/todos/DELETE';
const SET = 'universal-react/todos/SET';


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
      Object.keys(state).filter(id => (id !== action.result.id)).forEach((id) => {
        newState[id] = state[id];
      });
      return newState;
    }

    case SET:
      return action.result;

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

export function add(id, text, completed) {
  return {
    type: ADD,
    result: { id, text, completed }
  };
}

export function markRequest(id, completed) {
  return {
    types: [null, MARK, null],
    promise: ({ apiClient }) =>
      apiClient.post('/markTodo', { data: { id, completed } })
  };
}

export function mark(id, text, completed) {
  return {
    type: MARK,
    result: { id, text, completed }
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

export function setRequest() {
  return {
    types: [null, SET, null],
    promise: ({ apiClient }) =>
      apiClient.get('/getAllTodos')
  };
}
