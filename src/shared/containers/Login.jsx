import React, { Component } from 'react';
import Helmet from 'react-helmet';

class Login extends Component {
  render() {
    return (
      <div>
        <Helmet title="Login" />
        <h1>Login</h1>

        <form className="form-horizontal" id="form" method="post">
          <div className="form-group">
            <div className="col-sm-6 col-md-5 col-lg-4">
              <ul className="nav nav-tabs nav-justified">
                <li role="presentation" className="active">
                  <a href="#"><i className="fa fa-user"></i> Account</a>
                </li>
                <li role="presentation">
                  <a href="/auth/facebook"><i className="fa fa-facebook-square"></i> Facebook</a>
                </li>
                <li role="presentation">
                  <a href="/auth/google"><i className="fa fa-google"></i> Google</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-6 col-md-5 col-lg-4">
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-6 col-md-5 col-lg-4">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-4 col-md-3 col-lg-2">
              <button type="submit" className="btn btn-primary btn-block">Login</button>
            </div>
            <div className="col-sm-2 col-md-2 col-lg-2">
              <button
                type="submit"
                className="btn btn-default btn-block"
                onClick={() => (document.getElementById('form').action = '/signup')}
              >Register</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
