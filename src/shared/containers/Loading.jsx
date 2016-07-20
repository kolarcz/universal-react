import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import './Loading.scss';

const Layout = ({ reduxAsyncConnect, apiClientMiddleware }) => (
  <div
    className={
      `loading${reduxAsyncConnect.loaded && apiClientMiddleware.loaded ? ' none' : ''}`
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
