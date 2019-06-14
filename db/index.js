'use strict';

let util = require('util');
let path = require('path');
let fs = require('fs');

let readFile = util.promisify(fs.readFile);
let writeFile = util.promisify(fs.writeFile);

const filePath = path.resolve('db/cameras.json');

async function readCameras() {
  const json = await readFile(filePath);
  return JSON.parse(json);
}

async function writeCameras(cameras) {
  const json = JSON.stringify(cameras, null, 2);
  await writeFile(filePath, json);
}

async function createCamera(country) {
  const allCountries = await readCountries();
  await writeCountries(allCountries.concat(country));
}

