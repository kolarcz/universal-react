import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import counter from './counter';
import user from './user';
import flashes from './flashes';

export default ({
  router,
  reduxAsyncConnect,
  counter,
  user,
  flashes
});
