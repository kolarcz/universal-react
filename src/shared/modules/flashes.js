const ADD = 'universal-react/flashes/ADD';
const DELETE = 'universal-react/flashes/DELETE';
const SET = 'universal-react/flashes/SET';


export default function (state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, {
        type: action.data.type,
        message: action.data.message
      }];

    case DELETE:
      return [...state.slice(0, action.i), null, ...state.slice(action.i + 1)];

    case SET:
      return [...state, ...action.result];

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

export function load() {
  return {
    types: [null, SET, null],
    promise: ({ apiClient }) => new Promise((resolve) => {
      if (__CLIENT__) {
        resolve([]);
      } else {
        const req = apiClient.getServerReq();
        const flashes = req.flash();

        const flashesResult = [];
        Object.keys(flashes).forEach(type =>
          flashes[type].forEach(message =>
            flashesResult.push({ type, message })
          )
        );

        resolve(flashesResult);
      }
    })
  };
}
