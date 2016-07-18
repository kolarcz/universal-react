import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import activeComponent from 'react-router-active-component';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';

import { load as loadUser } from '../modules/user';
import { load as loadFlashes } from '../modules/flashes';

import Flashes from './Flashes';

const Link = activeComponent('li');

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './Layout.scss';

if (__CLIENT__) {
  require('script!jquery/dist/jquery.min.js');
  require('script!bootstrap/dist/js/bootstrap.min.js');
}

const Layout = ({ children, user }) => {
  const addLinkProps = {
    'data-toggle': 'collapse',
    'data-target': '.navbar-collapse.in'
  };

  return (
    <div>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        link={[{ rel: 'shortcut icon', href: require('../favicon.ico') }]}
        titleTemplate="%s | Universal React"
      />

      <header className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              className="navbar-toggle collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#bs-navbar"
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <span className="navbar-brand">
              <i className="fa fa-cube fa-lg" /> Universal React
            </span>
          </div>
          <nav id="bs-navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <Link {...addLinkProps} to="/" onlyActiveOnIndex>Home</Link>
              <Link {...addLinkProps} to="/counter">Counter</Link>
              <Link {...addLinkProps} to="/todos">Todos</Link>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              {user.name ? (
                <li>
                  <a href="/logout">
                    <i className="fa fa-sign-out fa-lg" /> Log out
                  </a>
                </li>
              ) : (
                <Link {...addLinkProps} to="/login">
                  <i className="fa fa-sign-in fa-lg" /> Log in
                </Link>
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
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
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
