import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import activeComponent from 'react-router-active-component';
import { asyncConnect } from 'redux-async-connect';

import { isLoaded as isUserLoaded } from '../modules/user';

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
                    <i className="fa fa-sign-out fa-lg" /> Logout
                  </a>
                </li>
              ) : (
                <Link {...addLinkProps} to="/login">
                  <i className="fa fa-sign-in fa-lg" /> Login
                </Link>
              )}
            </ul>
            {user.name ? (
              <p className="navbar-text navbar-right">
                <span className="photo-icon" style={{ background: `url('${user.photo}') #ddd` }} />
                Signed in as <strong>{user.name}</strong>
              </p>
            ) : null}
          </nav>
        </div>
      </header>

      <div className="container">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  user: PropTypes.any
};

export default asyncConnect([{
  key: 'user',
  promise: ({ store: { getState }, helpers: { apiClient } }) => (
    isUserLoaded(getState()) ? getState().reduxAsyncConnect.user : apiClient.get('/userInfo')
  )
}])(Layout);
