import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from '../shared/containers/Layout';
import Home from '../shared/containers/Home';
import Counter from '../shared/containers/Counter';
import Todos from '../shared/containers/Todos';
import Login from '../shared/containers/Login';

const makeRoutes = () => (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home} />
    <Route path="/counter" component={Counter} />
    <Route path="/todos" component={Todos} />
    <Route path="/login" component={Login} />
  </Route>
);

export default makeRoutes;
