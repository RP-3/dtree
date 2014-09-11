var should = require('should');
var dTree  = require('./dTree.js');
var index  = require('./index.js');

describe('dTree', function() {

  var root = new dTree('foo', './test.a.js', null);

  it('should have a name, parent, relativePath and depth calculated correctly', function() {


    root.should.have.enumerable('name', 'foo');
    root.should.have.enumerable('dependencies', {});
    root.should.have.enumerable('parent', null);
    root.should.have.enumerable('relativePath', './dTree.js');
    root.should.have.enumerable('depth', 1);
    
  });

  it('should build dependencies correctly', function(){

    //root.build()

  });

});
