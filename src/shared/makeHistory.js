import { createMemoryHistory } from 'history';
import { browserHistory } from 'react-router';

function makeHistory() {
  return __CLIENT__ ? browserHistory : createMemoryHistory();
}

export default makeHistory;
