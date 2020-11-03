//this document will be used to verifie if the user has a valid token

const jwt = require("jsonwebtoken"); //responsible for generate our webtoken
const config = require("config"); //responsible for call variables for other documents

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  //Verify token
  try {
    /**
     * jwt.verify is used for verify is the token was generated using the same password that we have in
     * default.json "jwtSecret", is everything is ok the token will be decoded and the value will be pass
     * to the decoded const
     */
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    /**
     * we're passing to our request the object user after it has been decoded above, and as bellow we're calling next()
     * it means that we're calling the next function, and in the moment that auth document is called it will pass the objet user
     * as a request
     */
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
