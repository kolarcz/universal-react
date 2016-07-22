import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Field, reduxForm } from 'redux-form';

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

const renderField = field => (
  <div className={`form-group${(field.touched && field.error ? ' has-error' : '')}`}>
    <div className="col-sm-6 col-md-5 col-lg-4">
      <input className="form-control" {...field.input} />
    </div>
    <div className="col-sm-6 col-md-5 col-lg-4">
      {field.touched && field.error && <div className="help-block">{field.error}</div>}
    </div>
  </div>
);

const Login = ({ submitting, pristine, invalid }) => (
  <div>
    <Helmet title="Log in" />
    <h1>Log in</h1>

    <form className="form-horizontal" id="form" method="post" action="/login">
      <Field name="username" type="text" placeholder="Username" component={renderField} />
      <Field name="password" type="password" placeholder="Password" component={renderField} />

      <div className="form-group">
        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={submitting || pristine || (!pristine && invalid)}
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
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired
};

export default reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate
})(Login);
