'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');


let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);

let userDbPath = path.resolve('db/users.json');


/**
 * Reads the file `users.json` and parses its JSON
 */
function readUsers() {
  return readFile(userDbPath)
    .then((json) => {
      return JSON.parse(json);
    });
}


/**
 * Writes to the `users.json` file
 */
function writeUsers(users) {
  return writeFile(userDbPath, JSON.stringify(users, null, 2));
}


/**
 * Determines if a user with a particular username already exists or not
 * @param {string} username
 * @returns {Promise<boolean>} whether a user exists or not
 */
function userExists(username) {
  return readUsers()
    .then((users) => {
      let exists = false;

      users.forEach((user) => {
        if (user.username === username) {
          exists = true;
        }
      });

      return exists;
    });
}


/**
 * Adds a user to the database
 * @param {object} user
 * @returns {Promise<undefined>}
 */
function addUser(user) {
  return readUsers()
    .then((users) => {
      return writeUsers(users.concat(user));
    });
}


/**
 * Get user password hash
 * @param {string} username
 * @returns {Promise<string>}
 */
function getUserPasswordHash(username) {
  return readUsers()
    .then((users) => {
      let match;

      users.forEach((user) => {
        if (user.username === username) {
          match = user;
        }
      });

      if (!match) {
        throw new Error('User does not exist.');

      }

      return match.password;
    });
}


module.exports = {
  userExists: userExists,
  addUser: addUser,
  getUserPasswordHash: getUserPasswordHash,
};
