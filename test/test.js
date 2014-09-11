//Tree constructor
var fetch = require('./fetchDependencies.js');
var fs    = require('fs');
var asciitree = require('ascii-tree');

var Tree = function(name, relativePath, parent){
  this.name = name;
  this.dependencies = {};
  this.parent = parent || null;
  this.depth = this.parent ? this.parent.depth + 1 : 1;
};

Tree.prototype.build = function(depObj){
  if(typeof depObj === 'string'){
    depObj = fs.readFileSync(depObj, 'utf8');
  }

  for(var dependency in depObj){

    this.dependencies[dependency] = new Tree(dependency, depObj[dependency], this);

    if(this.dependencies[dependency].relativePath){
      var path = this.dependencies[dependency].relativePath;
      var file = fs.readFileSync(path, 'utf8');
      var localDeps = fetch(file);
      //TODO: insert function to correctly handle relative filePaths
      this.dependencies[dependency].build(localDeps);
    }
  }
};

Tree.prototype.translate = function(called){
  if (!called){
    fs.writeFileSync('temp.txt', '\n'); //set up file to write to
    called = true;
  }

  for(var dependency in this.dependencies){
    //create a tag and save it to the output file
    var hashes = this.dependencies[dependency].depth;
    var depthTag = '';
    for(var i=0; i<hashes; i++){
      depthTag = depthTag + '#';
    }
    var completeTag = depthTag + dependency;
    fs.appendFileSync('temp.txt', completeTag, 'utf8');

    //recurse
    this.dependencies[dependency].translate(true);
  }

};

Tree.prototype.print = function(){
  //create a translation of the tree on disk
  this.translate(false);

  //generate ASCII tree from temp.txt on disk
  var str = fs.readFileSync('temp.txt', 'utf8');
  var tree = asciitree.generate(str);

  //log the output from disk
  fs.writeFileSync('output.txt', tree, 'utf8');
  console.log(fs.readFileSync('output.txt', 'utf8'));

  //delete the temp files
  fs.unlinkSync('temp.txt');
  fs.unlinkSync('output.txt');
};

module.exports = Tree;

Tree.prototype.hasCycle = function(dependency, result){
  result = result || 0;

  if(this.parent){

    if(this.parent.name === dependency){
      result++;
    }

    this.parent.hasCycle(dependency, result);

  }else{

    return result;

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

























