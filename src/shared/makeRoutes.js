import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Layout from '../shared/containers/Layout';
import Page1 from '../shared/containers/Page1';
import Page2 from '../shared/containers/Page2';

const makeRoutes = () => {
  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={Page1}/>
      <Route path="/page2/:id" component={Page2}/>
    </Route>
  );
}

export default makeRoutes;
