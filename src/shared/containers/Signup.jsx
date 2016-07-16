import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { reduxForm } from 'redux-form';

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if (values.password !== values.password2) {
    errors.password2 = 'Passwords not match';
  }

  return errors;
};

const Signup = ({ fields: { username, password, password2 }, submitting, invalid }) => (
  <div>
    <Helmet title="Sign up" />
    <h1>Sign up</h1>

    <form className="form-horizontal" id="form" method="post" action="/signup">
      <div className={`form-group${(username.touched && username.error ? ' has-error' : '')}`}>
        <div className="col-sm-6 col-md-5 col-lg-4">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username"
            {...username}
          />
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
          {password.touched && password.error && <div className="help-block">{password.error}</div>}
        </div>
      </div>
      <div className={`form-group${(password2.touched && password2.error ? ' has-error' : '')}`}>
        <div className="col-sm-6 col-md-5 col-lg-4">
          <input
            type="password"
            className="form-control"
            placeholder="Password again"
            {...password2}
          />
          {
            password2.touched &&
            password2.error &&
              <div className="help-block">{password2.error}</div>
          }
        </div>
      </div>
      <div className="form-group">
        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={submitting || invalid}
          >
            Sign up
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
    </form>
  </div>
);


Signup.propTypes = {
  fields: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired
};

export default reduxForm({
  form: 'signup',
  fields: ['username', 'password', 'password2'],
  validate
})(Signup);
