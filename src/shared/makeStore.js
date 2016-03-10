import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';

import reducer from './modules';

function makeStore(history, initialState) {
  let store;

  if (__DEV__) {
    store = createStore(reducer, initialState, compose(
      applyMiddleware(...[
        thunkMiddleware
      ].concat(__CLIENT__ ? createLogger({ collapsed: true }) : [])),
      __CLIENT__ ? persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)) : f => f,
      (__CLIENT__ && window.devToolsExtension) ? window.devToolsExtension() : f => f
    ));

    if (module.hot) {
      module.hot.accept('./modules', () =>
        store.replaceReducer(require('./modules'))
      );
    }
  } else {
    store = createStore(reducer, initialState, compose(
      applyMiddleware(
        thunkMiddleware
      )
    ));
  }

  return store;
}

export default makeStore;
