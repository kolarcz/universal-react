const LOAD = 'universal-react/user/LOAD';
const LOAD_SUCCESS = 'universal-react/user/LOAD_SUCCESS';
const LOAD_FAIL = 'universal-react/user/LOAD_FAIL';


export default function (state = { loaded: false }, action) {
  switch (action.type) {
    case LOAD:
      return {
        loaded: false
      };

    case LOAD_SUCCESS:
      return {
        ...action.result,
        loaded: true
      };

    case LOAD_FAIL:
      return {
        loaded: false
      };

    default:
      return state;
  }
}


export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ apiClient }) => apiClient.get('/userInfo')
  };
}


export function isLoaded(globalState) {
  return globalState.user.loaded;
}
