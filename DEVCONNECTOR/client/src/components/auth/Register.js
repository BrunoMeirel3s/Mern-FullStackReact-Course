import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; //allow-us to connect this component to redux
import { setAlert } from "../../actions/alert"; //action that w're going to use to cope with the erros
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

/**
 * Register will contain the values and method setFormData that
 * will insert the values sent by the frontEnd in the values bellow
 */
const Register = ({ setAlert, register }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  //we're destructuring the values for use in our HTML in the value attribute
  const { name, email, password, password2 } = formData;

  /**
   * The onChange method is responsible for call the method setFormData
   * that receive three paramethers the values of formData, '[e.target.name]' that is the
   * atribute that had it value changed, e.target.value that is the value inserted in our frontEnd
   * it means for example that when we insert a value in our name input:
   * 'e.target.name' = name : 'e.target.value' = 'Bruno Meireles'
   */
  const onChange = (e) =>
    //setFormData insert the value of the input in it correspondent value of formData
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * onSubmit will be call when we send our filled form,
   * e.preventDefault() is used for remove the initial methods
   * of the form and allow us to create our own methods
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({ name, email, password });
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            name="email"
            onChange={(e) => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            minLength="6"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            minLength="6"
            name="password2"
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};
/**
 * The connect method here is responsible for call the actions that we're
 * using in this component, after call it here we can use the
 * props.setAlert
 */
export default connect(null, { setAlert, register })(Register);
