var fetch = require('./fetchDependencies.js');
var fs    = require('fs');
var asciitree = require('ascii-tree');
var chalk = require('chalk');
var colors = require('colors');

//output variable. String to be modified as traversal occcurs
var output = '';

//error flags to only log errors once
var circular = false;
var moduleFail = false;


//Tree constructor
var Tree = function(name, relativePath, parent){
  this.name = name;
  this.dependencies = {};
  this.parent = parent || null;
  this.relativePath = relativePath; //path from parent to this
  this.originPath = this.parent ? this.parent.completePath.slice(0, this.parent.completePath.lastIndexOf("/")+1) : ''; //path from origin to parent
  this.completePath = this.originPath && this.relativePath ? this.originPath + this.relativePath.replace(/^.\//, '') : this.relativePath; //path from origin to this
  this.depth = this.parent ? this.parent.depth + 1 : 1;
};

Tree.prototype.build = function(depObj){
  if(typeof depObj === 'string'){
    depObj = fs.readFileSync(depObj, 'utf8');
  }

  for(var dependency in depObj){

    if(this.hasCycle(dependency)){
      circular = true;
      this.name += (" (Circular) Requires " + dependency).yellow;
      continue;
    }

    this.dependencies[dependency] = new Tree(dependency, depObj[dependency], this);

    if(this.dependencies[dependency].relativePath){
      var relative = this.dependencies[dependency].relativePath;
      var path = this.dependencies[dependency].completePath;

      try{
        var file = fs.readFileSync(path, 'utf8');
        var localDeps = fetch(file);
        this.dependencies[dependency].build(localDeps);
      }
      catch(e){
        try{
          var file = fs.readFileSync(path+'.js', 'utf8');
          var localDeps = fetch(file);
          this.dependencies[dependency].build(localDeps);
        }
        catch(err){
          console.log("Warning: Failed to load module at: ".red + path.underline.red);
          if(moduleFail){
            this.name += (", "+dependency).magenta;
          }else{
            this.name += (" (Failed) Requires " + dependency).magenta;
          }

          moduleFail = true;
          
        }
      }

    }
  }
};

Tree.prototype.translate = function(called){
  if (!called){
    output += '#' + this.name + '\n';
    called = true;
  }

  for(var dependency in this.dependencies){
    //create a tag and save it to the output file
    var hashes = this.dependencies[dependency].depth;
    var depthTag = '';
    for(var i=0; i<hashes; i++){
      depthTag = depthTag + '#';
    }
    var completeTag = depthTag + this.dependencies[dependency].name;
    output += completeTag + '\n';

    //recurse
    this.dependencies[dependency].translate(true);
  }

};

Tree.prototype.print = function(){
  //create a translation of the tree on disk
  this.translate(false);

  var tree = asciitree.generate(output);

  //log the output from disk
  console.log('\n', chalk.green(tree), '\n');

  //log errors
  if(moduleFail) console.log("Try 'npm install' and make sure all dependencies are loaded. dtree cannot currently handle variables in module names. \n".yellow);
  if(circular) console.log("Warning: One or more cyclcal dependencies detected. See tree for details.".yellow);
};


Tree.prototype.hasCycle = function(dependency, result){
  result = result || 0;

  if(this.parent){
    if(this.parent.name === dependency){
      return true;
    }
    return this.parent.hasCycle(dependency, result);
  }else{
    return false;
  }
};

Tree.prototype.testForCycles = function(){
  var result = [];

  for(var dependency in this.dependencies){
    var dep = this.hasCycle(dependency);
    if(dep){
      result.push([dependency, dep]);
    }
  }

  if(result.length){
    return result;
  }else{
    return false;
  }

};

module.exports = Tree;
