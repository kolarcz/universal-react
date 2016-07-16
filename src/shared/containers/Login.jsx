import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const Login = ({ fields: { username, password }, submitting, invalid }) => (
  <div>
    <Helmet title="Log in" />
    <h1>Log in</h1>

    <form
      className="form-horizontal"
      id="form"
      method="post"
      action="/login"
    >
      <div className={`form-group${(username.touched && username.error ? ' has-error' : '')}`}>
        <div className="col-sm-6 col-md-5 col-lg-4">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            {...username}
          />
        </div>
        <div className="col-sm-6 col-md-5 col-lg-4">
          {username.touched && username.error && <div className="help-block">{username.error}</div>}
        </div>
      </div>
      <div className={`form-group${(password.touched && password.error ? ' has-error' : '')}`}>
        <div className="col-sm-6 col-md-5 col-lg-4">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            {...password}
          />
        </div>
        <div className="col-sm-6 col-md-5 col-lg-4">
          {password.touched && password.error && <div className="help-block">{password.error}</div>}
        </div>
      </div>
      <div className="form-group">
        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={submitting || invalid}
          >
            Log in
          </button>
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
      <div className="form-group">
        <div className="col-lg-12">
          You don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </form>
  </div>
);

Login.propTypes = {
  fields: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired
};

export default reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate
})(Login);
