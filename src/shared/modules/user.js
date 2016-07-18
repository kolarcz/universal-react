const SET = 'universal-react/user/SET';


export default function (state = {}, action) {
  switch (action.type) {
    case SET:
      return { ...action.result };

    default:
      return state;
  }
}


export function load() {
  return {
    types: [null, SET, null],
    promise: ({ apiClient }) =>
      Promise.resolve(__CLIENT__ ? {} : apiClient.getServerReq().user)
  };
}
