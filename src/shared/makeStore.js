import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistory } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';

import reducer from './modules';

function makeStore(history, initialState) {
  const routerMiddleware = syncHistory(history);
  let store;

  if (__DEV__) {
    store = createStore(reducer, initialState, compose(
      applyMiddleware(...[
        thunkMiddleware,
        routerMiddleware
      ].concat(__CLIENT__ ? createLogger({ collapsed: true }) : [])),
      __CLIENT__ ? persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)) : f => f,
      (__CLIENT__ && window.devToolsExtension) ? window.devToolsExtension() : f => f
    ));

    if (module.hot) {
      module.hot.accept('./modules', () =>
        store.replaceReducer(require('./modules'))
      );
    }

    if (__CLIENT__) {
      routerMiddleware.listenForReplays(store);
    }
  } else {
    store = createStore(reducer, initialState, compose(
      applyMiddleware(
        routerMiddleware,
        thunkMiddleware
      )
    ));
  }

  return store;
}

export default makeStore;
