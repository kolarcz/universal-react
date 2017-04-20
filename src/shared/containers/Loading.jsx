import React from 'react';
import PropTypes from 'prop-types';
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
  reduxAsyncConnect: PropTypes.shape({
    loaded: PropTypes.bool.isRequired
  }).isRequired,
  apiClientMiddleware: PropTypes.shape({
    loaded: PropTypes.bool.isRequired
  }).isRequired
};

export default connect(state => ({
  reduxAsyncConnect: state.reduxAsyncConnect,
  apiClientMiddleware: state.apiClientMiddleware
}), {})(Layout);
