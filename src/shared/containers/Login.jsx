import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

const validate = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};

const renderField = ({ input, meta: { touched, error }, ...rest }) => (
  <div className={`form-group${(touched && error ? ' has-error' : '')}`}>
    <div className="col-sm-6 col-md-5 col-lg-4">
      <input className="form-control" {...input} {...rest} />
    </div>
    <div className="col-sm-6 col-md-5 col-lg-4">
      {touched && error && <div className="help-block">{error}</div>}
    </div>
  </div>
);

renderField.propTypes = {
  input: PropTypes.any.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string
  }).isRequired
};

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
            <i className="fa fa-lg fa-facebook-square" />
          </a>
          {'   '}
          <a className="btn btn-default" href="/auth/google">
            <i className="fa fa-lg fa-google" />
          </a>
        </div>
      </div>
      <div className="form-group">
        <div className="col-lg-12">
          You don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </form>
  </div>
);

Login.propTypes = {
  ...reduxFormPropTypes
};

export default reduxForm({
  form: 'login',
  fields: ['username', 'password'],
  validate
})(Login);
