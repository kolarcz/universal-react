export default function apiClientMiddleware(apiClient) {
  return ({ dispatch, getState }) => (next) => (action) => {
    // redux-thunk
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    if (REQUEST) {
      next({ ...rest, type: REQUEST });
    }

    const actionPromise = promise({ apiClient });
    actionPromise.then(
      SUCCESS ? (result => next({ ...rest, result, type: SUCCESS })) : null,
      FAILURE ? (error => next({ ...rest, error, type: FAILURE })) : null
    );

    return actionPromise;
  };
}
