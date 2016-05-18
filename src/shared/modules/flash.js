const ADD = 'universal-react/flash/ADD';


export default function (state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, {
        type: action.data.type,
        message: action.data.message
      }];

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
