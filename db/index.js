'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);

const filePath = path.resolve('db/cameras.json');

async function readCameras() {
  const json = await readFile(filePath, 'utf8');
  return JSON.parse(json);
}

async function getNewItemID() {

  const allCameras = await readCameras();
  return allCameras.length+1 ;
}

async function writeCameras(cameras) {
  const json = JSON.stringify(cameras, null, 2);
  await writeFile(filePath, json, 'utf8');
}

async function createCamera(camera) {
  const allCameras = await readCameras();
  await writeCameras(allCameras.concat(camera));

}

async function getCameraById(id) {

  const allCameras = await readCameras();

  let founditem ;
  allCameras.forEach((camera) => {

    if (camera.id === parseInt(id)) {

      founditem = camera ;

    }
  });

  return founditem;

}

async function cameraExists(brand,model) {
  const cameras = await readCameras();
  return cameras.some(camera => camera.brand === brand && camera.model === model);
}

module.exports = {
  getNewItemID,
  getCameraById,
  cameraExists,
  createCamera,
  getAllCameras: readCameras,
};
