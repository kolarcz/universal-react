import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import count from './count';
import todo from './todo';

export default combineReducers({
  router,
  count,
  todo
});
