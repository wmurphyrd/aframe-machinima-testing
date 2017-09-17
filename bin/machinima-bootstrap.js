#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const glob = require('glob');

const packageJsonFile = fs.readFileSync('./package.json');
if (!packageJsonFile) {
  throw new Error('package.json not found. Must call from package root directory');
}
const packageJson = JSON.parse(packageJsonFile);

shell.mkdir('machinima_tests');
glob.sync(path.resolve(__dirname, '../templates/*')).forEach(file => {
  shell.cp('-r', file, './machinima_tests');
});

if (!packageJson.scripts) {
  packageJson.scripts = {};
}
packageJson.scripts['test:machinima'] =
    'karma start ./machinima_tests/karma.conf.js';
packageJson.scripts['record:machinima'] =
    'budo machinima_tests/main.js:build.js --dir machinima_tests/scenes ' +
    '--port 8000 --live --open';
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
