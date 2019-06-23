'use strict';

let argon = require('argon2');
let usersdb = require('../db/users');


/**
 * used by POST /login route to verify user exists and match to login
 */
function postLoginRoute(req, res, next) {
  usersdb.userExists(req.body.username)
    .then((usernameExists) => {


      console.log(req.body, usernameExists);
      let formErrors = {
        username: (usernameExists && req.body.username) ? null : 'Username not provided or not authorized for access',
        password: (req.body.password) ? null : 'Password not provided',
      };

      // Login is not valid if username does not exist or password not provided

      if (formErrors.username || formErrors.password) {
        res
          .status(400)
          .json({
            message: `User Access failed. Reason identified below `,
            content: formErrors
          })

        // return false;
      // Else if the form values are valid
      } else {

        return usersdb.getUserPasswordHash(req.body.username)
          .then((dbHash) => {
            return argon.verify(dbHash, req.body.password);
          });

      }

    })
    .then((isValid) => {
      // If invalid respond with authentication failure
      if (!isValid) {
        res
          .status(401)
          .json({
            message: `Authentication Failure. Incorrect password provided `
          })
      // Else log user in
      } else {
        req.session.username = req.body.username;
        res
          .json({
            message: `Login Successful `
          })
      }
    })
    .catch(next);
}


module.exports = {
  post: postLoginRoute,
};
