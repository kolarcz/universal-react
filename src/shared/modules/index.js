import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import counter from './counter';
import todos from './todos';

export default combineReducers({
  router,
  counter,
  todos
});
