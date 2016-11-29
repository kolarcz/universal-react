const BEGIN = '@apiClientMiddleware/PROMISE_BEGIN';
const END = '@apiClientMiddleware/PROMISE_END';

export function reducer(state = { loaded: true, promises: 0 }, action) {
  let newState;

  switch (action.type) {
    case BEGIN:
      newState = { ...state, promises: state.promises + 1 };
      newState.loaded = (newState.promises === 0);
      return newState;

    case END:
      newState = { ...state, promises: state.promises - 1 };
      newState.loaded = (newState.promises === 0);
      return newState;

    default:
      return state;
  }
}

const actionPromiseBegin = () => ({ type: BEGIN });
const actionPromiseEnd = () => ({ type: END });

export default function apiClientMiddleware(apiClient) {
  return ({ dispatch, getState }) => next => (action) => {
    // redux-thunk
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;

    next(actionPromiseBegin());

    if (REQUEST) {
      next({ ...rest, type: REQUEST });
    }

    const actionPromise = promise({ apiClient });

    actionPromise.then(
      () => next(actionPromiseEnd()),
      () => next(actionPromiseEnd())
    );

    actionPromise.then(
      SUCCESS ? (result => next({ ...rest, result, type: SUCCESS })) : null,
      FAILURE ? (error => next({ ...rest, error, type: FAILURE })) : null
    );

    return actionPromise;
  };
}
