import { createMemoryHistory } from 'history';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

function makeHistory(store) {
  if (__CLIENT__) {
    return syncHistoryWithStore(browserHistory, store, {
      selectLocationState: (state) => state.router
    });
  } else {
    return createMemoryHistory();
  }
}

export default makeHistory;
