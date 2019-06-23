'use strict';

let argon = require('argon2');
// let db = require('../../db');
let usersdb = require('../db/users');

function postRegisterRoute(req, res, next) {
  // First we check if the username provided already exists
  usersdb.userExists(req.body.username)
    .then((usernameExists) => {
      // Check if form values are valid
      console.log(req.body, usernameExists);
      let formErrors = {
        username: (!usernameExists && req.body.username) ? null : 'Invalid username',
        password: (req.body.password && req.body.password.length >= 6) ? null : 'Invalid password',
      };

      // If there are any errors do not register the user
      if (formErrors.username || formErrors.password) {
        res
          .status(400)
          .json({
            message: `User registration failed. Reason is identified below `,
            content: formErrors
          })
      // Else if the form values are valid
      } else {
        return argon.hash(req.body.password)
          .then((dbHash) => {
            let newUser = {
              username: req.body.username,
              password: dbHash,
            };

            return usersdb.addUser(newUser);
          })
          .then(() => {
            // res.redirect('/login');
            res.json({
              message: `User, ${req.body.username}, registration Success and completed`
            });
          });
      }
    })
    .catch(next);
}


module.exports = {
  post: postRegisterRoute,
};
