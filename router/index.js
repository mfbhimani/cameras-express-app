'use strict';

const express = require('express');

const router = express.Router();


// Renders the home page
router.get('/', (req, res) => {
  res.render('home');
});

// route to handle registration of inputs: username and password

router.post('/register', (req, res, next) => {
  res.sendStatus(200);
});

// route to handle login with specific inputs provided: username and password

router.post('/login', (req, res, next) => {
  res.sendStatus(200);
});

// get list of cameras

router.get('/camera', (req, res, next) => {
  res.sendStatus(200);
});

// get camera by ID

router.get('/camera/:id', (req, res, next) => {
  res.sendStatus(200);
});

// create camera

router.post('/camera', (req, res, next) => {
  res.sendStatus(200);
});

// updating camera by ID

router.put('/camera/:id', (req, res, next) => {
  res.sendStatus(200);
});

// deleting camera by ID

router.delete('/camera/:id', async (req, res, next) => {
  res.sendStatus(200);
});

module.exports = router;
