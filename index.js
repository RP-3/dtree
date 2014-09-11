#!/usr/bin/env node

/*
features to highlight:
- multiple require statements -> implement unique counter
- requirements that are never used -> more fancy regex... do this last
- dependency cycles -> check global Dependencies
*/


var args  = process.argv.slice(2);
var dTree = require('./dTree.js');
var fs    = require('fs');
var fetch = require('./fetchDependencies.js');

function readRecurse(filePath){
  var file = fs.readFileSync(filePath, 'utf8');
  var localDependencies = fetch(file);

  //create a dependency tree
  var root = new dTree(filePath, filePath, null);
  root.build(localDependencies);

  root.print();

}

readRecurse(args[0]);
