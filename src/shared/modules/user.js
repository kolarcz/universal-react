const SET = 'universal-react/user/SET';


export default function (state = {}, action) {
  switch (action.type) {
    case SET:
      return { ...action.data };

    default:
      return state;
  }
}


export function set(data) {
  return {
    type: SET,
    data
  };
}
