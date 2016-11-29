import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import css from './Loading.scss';

const Layout = ({ reduxAsyncConnect, apiClientMiddleware }) => (
  <div
    className={
      `${css.loading}${reduxAsyncConnect.loaded && apiClientMiddleware.loaded ? ` ${css.none}` : ''}`
    }
  />
);

Layout.propTypes = {
  reduxAsyncConnect: PropTypes.object.isRequired,
  apiClientMiddleware: PropTypes.object.isRequired
};

export default connect(state => ({
  reduxAsyncConnect: state.reduxAsyncConnect,
  apiClientMiddleware: state.apiClientMiddleware
}), {})(Layout);
