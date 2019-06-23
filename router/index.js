'use strict';

const express = require('express');
let db = require('../db');
let registerRoute = require('./register');
let loginRoute = require('./login');
const router = express.Router();


// Renders the home page
router.get('/', async (req, res) => {
  // res.render('home');
  const cameras = await db.getAllCameras();

  res.render('home', {
    cameras,
    pageId: 'home',
    title: 'Camera Store',
  });
});

// route to handle registration of inputs: username and password

router.post('/register', registerRoute.post);


// route to handle login with specific inputs provided: username and password

router.post('/login', loginRoute.post);

// get list of cameras

router.get('/camera', async (req, res, next) => {

  try {
    const allcameras = await db.getAllCameras();

    if (allcameras.length === 0) {
      res.json({message: 'no cameras available'});
    } else {
      res.send(allcameras);
    }


  } catch (error) {
    next(error);
    return; // Ensures rest of function doesn't run
  }
});

// get camera by ID

router.get('/camera/:id', async (req, res, next) => {
  // check if id is an integer
  if (!Number.isInteger(parseInt(req.params.id))) {
    res
      .status(400)
      .json({message:'ID needs to be an integer'})
  } else {
    db.getCameraById(req.params.id)
      .then((camera) => {
        if (camera == null) {
          res
            .status(400)
            .json({message:'no camera found by ID specified'})
        } else {
          res.send(camera);
        }
      })
      .catch(next);

  }
});

// create camera

router.post('/camera', async (req, res, next) => {

  const jsonReqErrors = {};

  if (!req.body.brand) {
    jsonReqErrors.brand = 'Error: json key/value pair of brand not defined or empty. Required';
  }
  if (!req.body.model) {
    jsonReqErrors.model = 'Error: json key/value pair of model not defined or empty. Required';
  }
  if (!req.body.sensor) {
    jsonReqErrors.sensor = 'Error: json key/value pair of sensor not defined or empty. Required';
  }
  if (!req.body.megapixels) {
    jsonReqErrors.megapixels = 'Error: json key/value pair of megapixels not defined or empty. Required';
  }
  if (!req.body.viewfinder) {
    jsonReqErrors.viewfinder = 'Error: json key/value pair of viewfinder not defined or empty. Required';
  }
  if (!req.body.price) {
    jsonReqErrors.price = 'Error: json key/value pair of price not defined or empty. Required';
  }

  // check if camera info of brand and model exists in the json file data
  if (!jsonReqErrors.brand && !jsonReqErrors.model) {
    try {
      // check if duplicate camera exists using lookup key of brand and model combined
      const exists = await db.cameraExists(req.body.brand, req.body.model);
      if (exists) jsonReqErrors.global = 'Duplicate camera of brand and model found.';
    } catch (error) {
      next(error);
      return; // Ensures rest of function doesn't run
    }
  }
  // if jsonReqError object contains error messages of json data
  if (Object.keys(jsonReqErrors).length) {
    res
      .status(400)
      .json(jsonReqErrors);
    // return;
  } else {

    try {
      // get new id for the camera
      const newid = await db.getNewItemID();
      let newcamera = { id: newid, ...req.body};
      await db.createCamera(newcamera);
      res.json(newcamera);
    } catch (error) {
      next(error);
    }
  }
});

// updating camera by ID

router.put('/camera/:id', async (req, res, next) => {

  if (!Number.isInteger(parseInt(req.params.id))) {
    res
      .status(400)
      .json({message:'ID needs to be an integer'})
  } else {

    const jsonReqErrors = {};

    if (!req.body.brand) {
      jsonReqErrors.brand = 'Error: json key/value pair of brand not defined or empty. Required';
    }
    if (!req.body.model) {
      jsonReqErrors.model = 'Error: json key/value pair of model not defined or empty. Required';
    }
    if (!req.body.sensor) {
      jsonReqErrors.sensor = 'Error: json key/value pair of sensor not defined or empty. Required';
    }
    if (!req.body.megapixels) {
      jsonReqErrors.megapixels = 'Error: json key/value pair of megapixels not defined or empty. Required';
    }
    if (!req.body.viewfinder) {
      jsonReqErrors.viewfinder = 'Error: json key/value pair of viewfinder not defined or empty. Required';
    }
    if (!req.body.price) {
      jsonReqErrors.price = 'Error: json key/value pair of price not defined or empty. Required';
    }

    if (Object.keys(jsonReqErrors).length) {
      res
        .status(400)
        .json(jsonReqErrors);
      // return;
    } else {

      db.getCameraById(req.params.id)
        .then((camera) => {
          if (camera == null) {
            res
              .status(400)
              .json({message:'no camera found by ID specified'})
          } else {

            // const allcameras = await db.getAllCameras();
            db.getAllCameras()
              .then ((allcameras) => {
                const index = allcameras.findIndex(p => p.id == camera.id);
                const id = { id: camera.id} ;
                allcameras[index] = {...id, ...req.body} ;
                db.writeCameras(allcameras)
                  .then (() => {
                    res.json({
                      message: `Camera of id ${req.params.id} has been updated `,
                      content: req.body
                    })
                  })
                  .catch((err) => {
                    if (err.status) {
                      res
                        .status(err.status)
                        .json({message: err.message})
                    }
                    else {
                      res
                        .status(500)
                        .json({message: err.message})
                    }
                  })

              })

          }


        })
        .catch((err) => {
          if (err.status) {
            res
              .status(err.status)
              .json({message: err.message})
          }
          else {
            res
              .status(500)
              .json({message: err.message})
          }
        })

    }
  }
});

// deleting camera by ID

router.delete('/camera/:id', async (req, res, next) => {

  if (!Number.isInteger(parseInt(req.params.id))) {
    res
      .status(400)
      .json({message:'ID needs to be an integer'})
  } else {
    db.getCameraById(req.params.id)
      .then((camera) => {
        if (camera == null) {
          res
            .status(400)
            .json({message:'no camera found by ID specified'})
        } else {
          db.deleteCamera(camera)
            .then(() => {
              res
                .json({message: `Camera of id #${req.params.id} has been deleted.`})
            })
            .catch((err) => {
              if (err.status) {
                res
                  .status(err.status)
                  .json({message: err.message})
              }
              else {
                res
                  .status(500)
                  .json({message: err.message})
              }
            })
        }
      })
      // .catch(next);
      .catch((err) => {
        if (err.status) {
          res
            .status(err.status)
            .json({message: err.message})
        }
        else {
          res
            .status(500)
            .json({message: err.message})
        }
      })

  }

});

module.exports = router;
