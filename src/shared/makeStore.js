import { createStore, applyMiddleware, compose } from 'redux';

import ReducerRegistry from './ReducerRegistry';
import apiClientMiddleware from './apiClientMiddleware';
import reducers from './modules/index';

function makeStore(apiClient, initialState) {
  let composed;

  if (__DEV__) {
    const createLogger = require('redux-logger').createLogger;
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

  const reducerRegistry = new ReducerRegistry(reducers, initialState);

  const store = createStore(reducerRegistry.getMainReducer(), initialState, composed);
  store.registerReducers = reducerRegistry.register.bind(reducerRegistry);

  reducerRegistry.setChangeListener(mainReducer =>
    store.replaceReducer(mainReducer)
  );

  if (module.hot) {
    module.hot.accept('./modules/index', () =>
      reducerRegistry.register(require('./modules/index').default)
    );
  }

  return store;
}

export default makeStore;
