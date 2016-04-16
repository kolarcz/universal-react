import { get } from 'lodash';

export function isLoaded(globalState) {
  return get(globalState, 'reduxAsyncConnect.loadState.user.loaded');
}
