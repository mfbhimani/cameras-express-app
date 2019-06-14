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

async function writeCameras(cameras) {
  const json = JSON.stringify(cameras, null, 2);
  await writeFile(filePath, json);

  const json = JSON.stringify(items, null, 2);
  return writeFile(dbfilepath, json, 'utf8')
}

async function createCamera(country) {
  const allCountries = await readCountries();
  await writeCountries(allCountries.concat(country));

  items.push(newItem);
  return writeitems(items);
}

asyc function getitembyid(id) {

  const items = await readitems();

  let matcheditem ;
  items.forEach((item) => {
    if (item.id === id) {
      matcheditem = item ;
    }
  });

  res.json(item);
}
