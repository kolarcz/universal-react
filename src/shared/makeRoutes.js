import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from './containers/Layout';
import Home from './containers/Home';
import Counter from './containers/Counter';
import Login from './containers/Login';

if (typeof require.ensure !== 'function') {
  require.ensure = (d, c) => c(require);
}

const makeRoutes = (store) => (
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
          cb(null, require('./containers/Todos'));
        });
      }}
    />
    <Route path="/login" component={Login} />
  </Route>
);

export default makeRoutes;
