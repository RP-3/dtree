var should = require('should');
var fs = require('fs');
var fetchDependencies = require('./fetchDependencies.js');


//setup procedure: establish a test folder to write to
var exists = function(path){
  return fs.exists(path);
};

var testFolder = './test';

while(exists(testFolder)){
  testFolder += 1;
}

describe('fetchDependencies', function(){

  var input = 'require("./myFancyModule.js")';
  var longInput = "require('module1') \nrequire('module2.js')";
  var pathInput = "require('fooBot/funkyTown/anotherFoler/module.js')";

  var s = "s";
  var variableInput = "require('f' + s)"

  it('should return an object', function(){
    fetchDependencies(input).should.be.type('object');
  });

  it('should return a single dependency correctly', function(){
    Object.keys(fetchDependencies(input))[0].should.equal('myFancyModule.js');
  });

  it('should return multiple dependencies correctly', function(){
    Object.keys(fetchDependencies(longInput))[0].should.equal('module1');
    Object.keys(fetchDependencies(longInput))[1].should.equal('module2.js');
  });

  it('should return the correct module name in a given require statement', function(){
    Object.keys(fetchDependencies(input))[0].should.equal('myFancyModule.js');
  });

  it('should return the path to a module separately', function(){
    fetchDependencies(input)['myFancyModule.js'].should.equal('./myFancyModule.js');
  });

  it('should return the path to a deeply nested module correctly', function(){
    fetchDependencies(pathInput)['module.js'].should.equal('fooBot/funkyTown/anotherFoler/module.js');
  });

  // it('should correctly parse a module in a file including a variable in its name', function(){
  //   Object.keys(fetchDependencies(variableInput))[0].should.equal('fs');
  // });

});

