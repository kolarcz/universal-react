import React, { Component, PropTypes } from 'react';
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

class Layout extends Component {
  render() {
    const { user } = this.props;

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
                <Link to="/" onlyActiveOnIndex>Home</Link>
                <Link to="/counter">Counter</Link>
                <Link to="/todos">Todos</Link>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                { user.name ? (
                  <li>
                    <a href="/logout">
                      <i className="fa fa-sign-out fa-lg" /> Logout
                    </a>
                  </li>
                ) : (
                  <Link to="/login">
                    <i className="fa fa-sign-in fa-lg" /> Login
                  </Link>
                )}
              </ul>
              { user.name ? (
                <p className="navbar-text navbar-right" style={{ marginRight: '20px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      margin: '-13px 12px -13px 0px',
                      background: `url('${user.photo}') #ddd`,
                      backgroundSize: '100%'
                    }}
                  />
                  Signed in as <strong>{user.name}</strong>
                </p>
              ) : null }
            </nav>
          </div>
        </header>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  user: PropTypes.any,
  store: PropTypes.any
};

export default asyncConnect([{
  key: 'user',
  promise: ({ store: { getState }, helpers: { apiClient } }) => (
    isUserLoaded(getState()) ? getState().reduxAsyncConnect.user : apiClient.get('/userInfo')
  )
}])(Layout);
