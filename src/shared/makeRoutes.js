import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from '../shared/containers/Layout';
import Home from '../shared/containers/Home';
import Counter from '../shared/containers/Counter';
import Login from '../shared/containers/Login';

if (typeof require.ensure !== 'function') {
  require.ensure = (d, c) => c(require);
}

const makeRoutes = () => (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
    <Route path="/counter" component={Counter} />
    <Route
      path="/todos"
      getComponent={(location, cb) => {
        require.ensure([], require => {
          cb(null, require('../shared/containers/Todos'));
        });
      }}
    />
    <Route path="/login" component={Login} />
  </Route>
);

export default makeRoutes;
