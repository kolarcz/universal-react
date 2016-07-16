import React from 'react';
import Helmet from 'react-helmet';

const Signup = () => (
  <div>
    <Helmet title="Sign up" />
    <h1>Sign up</h1>

    <form className="form-horizontal" id="form" method="post" action="/signup">
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
        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
          <button type="submit" className="btn btn-success btn-block">Sign up</button>
        </div>
        <div className="col-xs-6 col-sm-3 col-md-2 col-lg-2">
          <a className="btn btn-default" href="/auth/facebook">
            <i className="fa fa-lg fa-facebook-square"></i>
          </a>
          {'   '}
          <a className="btn btn-default" href="/auth/google">
            <i className="fa fa-lg fa-google"></i>
          </a>
        </div>
      </div>
    </form>
  </div>
);

export default Signup;
