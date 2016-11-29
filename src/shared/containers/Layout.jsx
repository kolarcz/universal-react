import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import { load as loadUser } from '../modules/user';
import { load as loadFlashes } from '../modules/flashes';

import Flashes from './Flashes';
import Loading from './Loading';

import './Layout.scss';

const NavLink = withRouter(({ router, to, onlyActiveOnIndex, children }) => (
  <li className={router.isActive(to, onlyActiveOnIndex) ? 'active' : ''}>
    <Link to={to} data-toggle="collapse" data-target=".navbar-collapse.in">{children}</Link>
  </li>
));

if (__CLIENT__) {
  const jQuery = require('jquery/dist/jquery.min.js');
  global.jQuery = jQuery;
  global.$ = jQuery;

  require('bootstrap/dist/js/bootstrap.min.js');
}

const Layout = ({ children, user }) => (
  <div>
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      link={[{ rel: 'shortcut icon', href: require('../favicon.ico') }]}
      titleTemplate="%s | Universal React"
    />

    <Loading />

    <header className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            className="navbar-toggle collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#bs-navbar"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <span className="navbar-brand">
            <i className="fa fa-cube fa-lg" /> Universal React
          </span>
        </div>
        <nav id="bs-navbar" className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <NavLink to="/" onlyActiveOnIndex>Home</NavLink>
            <NavLink to="/counter">Counter</NavLink>
            <NavLink to="/todos">Todos</NavLink>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            {user.name ? (
              <li>
                <a href="/logout">
                  <i className="fa fa-sign-out fa-lg" /> Log out
                </a>
              </li>
            ) : (
              <NavLink to="/login">
                <i className="fa fa-sign-in fa-lg" /> Log in
              </NavLink>
            )}
          </ul>
          {user.name ? (
            <p className="navbar-text navbar-right">
              <span className="photo-icon" style={{ backgroundImage: `url('${user.photo}')` }} />
              Signed in as <strong>{user.name}</strong>
            </p>
          ) : null}
        </nav>
      </div>
    </header>

    <Flashes />

    <div className="container">
      {children}
    </div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.string
  }).isRequired
};

export default asyncConnect([{
  promise: ({ store: { dispatch } }) =>
    Promise.all(__CLIENT__ ? [] : [
      dispatch(loadUser()),
      dispatch(loadFlashes())
    ])
}])(connect(state => ({
  user: state.user
}), {})(Layout));
