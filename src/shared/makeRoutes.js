import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from '../shared/containers/Layout';
import Home from '../shared/containers/Home';
import Counter from '../shared/containers/Counter';
import Todo from '../shared/containers/Todo';

const makeRoutes = () => {
  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={Home}/>
      <Route path="/counter" component={Counter}/>
      <Route path="/todo" component={Todo}/>
    </Route>
  );
}

export default makeRoutes;
