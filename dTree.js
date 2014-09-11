var fetch = require('./fetchDependencies.js');
var fs    = require('fs');
var asciitree = require('ascii-tree');
var chalk = require('chalk');

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
      console.log(chalk.red("Cyclcal dependency detected: ", chalk.red.bold(this.name),  chalk.red(" requires "),  chalk.red.bold(dependency)) );
      continue;
    }

    this.dependencies[dependency] = new Tree(dependency, depObj[dependency], this);

    if(this.dependencies[dependency].relativePath){
      var relative = this.dependencies[dependency].relativePath;
      var path = this.dependencies[dependency].completePath; //this.dependencies[dependency].originPath ? this.dependencies[dependency].originPath + relative.replace(/^.\//, '')/*.slice(relative.indexOf("/")+1)*/ : relative;

      try{
        var file = fs.readFileSync(path, 'utf8');
        var localDeps = fetch(file);
        this.dependencies[dependency].build(localDeps);
      }
      catch(e){
        console.log(chalk.yellow("Warning: Failed to load module at: "), chalk.red(path));
        console.log(chalk.yellow("Try 'npm install' and make sure all dependencies are loaded."));
      }

    }
  }
};

Tree.prototype.translate = function(called){
  if (!called){
    fs.writeFileSync('temp.txt', ''); //set up file to write to
    fs.appendFileSync('temp.txt', '#' + this.name + '\n', 'utf8');
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
    fs.appendFileSync('temp.txt', completeTag + '\n', 'utf8');

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
  console.log('\n', chalk.green(fs.readFileSync('output.txt', 'utf8')), '\n');

  //delete the temp files
  fs.unlinkSync('temp.txt');
  fs.unlinkSync('output.txt');
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
