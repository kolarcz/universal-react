import { createStore, applyMiddleware, compose } from 'redux';

import apiClientMiddleware from './apiClientMiddleware';
import reducer from './modules';

function makeStore(apiClient, initialState) {
  let composed;

  if (__DEV__) {
    const createLogger = require('redux-logger').default;
    const persistState = require('redux-devtools').persistState;

    composed = compose(
      applyMiddleware(...[
        apiClientMiddleware(apiClient)
      ].concat(__CLIENT__ ? createLogger({ collapsed: true }) : [])),
      __CLIENT__ ? persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)) : f => f,
      (__CLIENT__ && window.devToolsExtension) ? window.devToolsExtension() : f => f
    );
  } else {
    composed = compose(
      applyMiddleware(
        apiClientMiddleware(apiClient)
      )
    );
  }

  const store = createStore(reducer, initialState, composed);

  if (__DEV__ && module.hot) {
    module.hot.accept('./modules', () =>
      store.replaceReducer(require('./modules'))
    );
  }

  return store;
}

export default makeStore;
