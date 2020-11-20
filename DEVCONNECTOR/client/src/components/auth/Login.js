import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Register will contain the values and method setFormData that
 * will insert the values sent by the frontEnd in the values bellow
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //we're destructuring the values for use in our HTML in the value attribute
  const { email, password } = formData;

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
    console.log("SUCCESS");
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            name="email"
            onChange={(e) => onChange(e)}
            required
          />
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
        <input type="submit" value="Login" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
