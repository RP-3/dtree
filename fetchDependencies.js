/*from Josh Wyatt and Drew Cuthbertson*/

// get all the module names inside of a given file that has been stringified
var findModuleNames = function(fileString){
  // find and store all the require statements using regEx
  var requireStatements = fileString.match(/require\([^()]+\)/g);
  var moduleNames = {};

  // parse out just the name of the module for each require statement
  if(requireStatements){

    for(var i = 0; i < requireStatements.length; i++){
      var requireStatement = requireStatements[i];

      // get just the module name without parens or quotes
      var indexOfInsideParens = requireStatement.indexOf('(') + 2;
      var moduleName = requireStatement.slice(indexOfInsideParens, requireStatement.length - 2);

      // handle custom modules which have paths
      var indexOfSlash = moduleName.lastIndexOf('/');
      if( indexOfSlash === -1 ){
        moduleNames[moduleName] = undefined;
      }else{
        var moduleNameStrippedOfSlashes = moduleName.slice(indexOfSlash + 1);
        moduleNames[moduleNameStrippedOfSlashes] = moduleName;
      }
    }

  }

  return moduleNames;
};

module.exports = findModuleNames;
