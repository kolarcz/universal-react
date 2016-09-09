import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { load as loadUser } from './modules/user';

import Layout from './containers/Layout';
import Home from './containers/Home';
import Counter from './containers/Counter';
import Login from './containers/Login';
import Signup from './containers/Signup';

if (typeof require.ensure !== 'function') {
  require.ensure = (d, c) => c(require);
}

const makeRoutes = store => {
  const requireLoggedOut = async (nextState, replace, cb) => {
    if (!__CLIENT__) {
      await store.dispatch(loadUser());
    }

    const { user } = store.getState();
    if (user.name) {
      replace('/');
    }

    cb();
  };

  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={Home} />
      <Route path="/counter" component={Counter} />
      <Route
        path="/todos"
        getComponent={(location, cb) => {
          require.ensure([], require => {
            if (module.hot) {
              module.hot.accept('./modules/todos', () =>
                store.registerReducers({ todos: require('./modules/todos').default })
              );
            }

            store.registerReducers({ todos: require('./modules/todos').default });
            cb(null, require('./containers/Todos').default);
          });
        }}
      />
      <Route onEnter={requireLoggedOut}>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Route>
    </Route>
  );
};

export default makeRoutes;
