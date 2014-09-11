#!/usr/bin/env node

var args  = process.argv.slice(2);
var dTree = require('./dTree.js');
var fs    = require('fs');
var fetch = require('./fetchDependencies.js');
var colors = require('colors');


function readRecurse(filePath){
  var file;
  try{
    file = fs.readFileSync(filePath, 'utf8');
  }
  catch(e){
    console.log("Undefined or invalid filePath.".red);
    console.log("E.g., use: dtree pathToYourFile.js \n".red);
    process.exit();
  }

  var localDependencies = fetch(file);

  //create a dependency tree
  var root = new dTree(filePath, filePath, null);
  root.build(localDependencies);

  root.print();

}

readRecurse(args[0]);
