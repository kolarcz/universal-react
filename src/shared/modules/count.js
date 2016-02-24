export const INCREASE = 'universal-react/counter/INCREASE';
export const DECREASE = 'universal-react/counter/DECREASE';

export default function (state = 1, action) {
  switch (action.type) {
    case INCREASE: return state + 1;
    case DECREASE: return state - 1;
    default: return state;
  }
};

export function increase() {
  return {
    type: INCREASE
  }
};

export function increaseAsync() {
  return dispatch => {
    setTimeout(() => {
      dispatch(increase());
    }, 500);
  };
};

export function decrease() {
  return {
    type: DECREASE
  }
};
