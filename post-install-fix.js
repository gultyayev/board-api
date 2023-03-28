/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const filePath = 'node_modules/dynamodb-localhost/dynamodb/config.json';
const installerFilePath =
  'node_modules/dynamodb-localhost/dynamodb/installer.js';

const file = readFileSync(path.join(__dirname, filePath), 'utf8');
const json = JSON.parse(file);
json.setup.download_url =
  'https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz';
writeFileSync(filePath, JSON.stringify(json));

console.info('Download url patched');

let installerFile = readFileSync(
  path.join(__dirname, installerFilePath),
  'utf8',
);
installerFile = installerFile.replace('require("http")', 'require("https")');
writeFileSync(installerFilePath, installerFile);

console.info('Http to http patched');
