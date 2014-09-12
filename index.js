#!/usr/bin/env node

var args  = process.argv.slice(2);
var dTree = require('./dTree.js');
var fs    = require('fs');
var fetch = require('./fetchDependencies.js');
var colors = require('colors');
var prompt = require('prompt');

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

if(args[0] === undefined){

  var options = fs.readdirSync('./').filter(function(element){
    return (element.indexOf('.js') !== -1);
  });

  if(options.length === 0){

    console.log("Error: no .js files detected in this folder.".red);

  }else if(options.length === 1){

    console.log(("Defaulting to " + options[0]).yellow);
    readRecurse(options[0]);

  }else{

    console.log('Multiple js files detected:'.yellow);

    for(var i=0; i<options.length; i++){
      console.log( (i+1) + " for " + options[i] );
    }

    var schema = {
      properties: {
        fileNo: {
          pattern: /[0-9]/,
          message: 'Enter the number corresponding to the file to dtree',
          required: true
        }
      }
    };

    prompt.start();

    prompt.get(schema, function(err, result){
      
      if(err){
        console.log(err);
        process.exit();
      }

      readRecurse(options[result.fileNo -1]);
      
    });

  }

}else{

  readRecurse(args[0]);

}
