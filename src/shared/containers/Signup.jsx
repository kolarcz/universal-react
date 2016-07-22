import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Field, reduxForm } from 'redux-form';

const validate = values => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.match(/[^a-z0-9.]/i)) {
    errors.username = 'Allowed only letters (a-z), numbers and dots';
  } else if (values.username.match(/(^\.|\.$)/)) {
    errors.username = 'Dots can\'t be at the beginning or the end';
  } else if (values.username.match(/\.\./)) {
    errors.username = 'There can\'t be multiple dots between themselves';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.password2) {
    errors.password2 = 'Required';
  } else if (values.password !== values.password2) {
    errors.password2 = 'Passwords not match';
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

const Signup = ({ submitting, pristine, invalid }) => (
  <div>
    <Helmet title="Sign up" />
    <h1>Sign up</h1>

    <form className="form-horizontal" id="form" method="post" action="/signup">
      <Field name="username" type="text" placeholder="Username" component={renderField} />
      <Field name="password" type="password" placeholder="Password" component={renderField} />
      <Field
        name="password2"
        type="password"
        placeholder="Password again"
        component={renderField}
      />

      <div className="form-group">
        <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
          <button
            type="submit"
            className="btn btn-success btn-block"
            disabled={submitting || pristine || (!pristine && invalid)}
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
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired
};

export default reduxForm({
  form: 'signup',
  fields: ['username', 'password', 'password2'],
  validate
})(Signup);
