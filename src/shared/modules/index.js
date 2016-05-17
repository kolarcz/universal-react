import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import counter from './counter';
import todos from './todos';
import user from './user';

export default combineReducers({
  router,
  reduxAsyncConnect,
  counter,
  todos,
  user
});
