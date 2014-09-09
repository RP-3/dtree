#!/usr/bin/env node

console.log(process.argv);

var fs = require('fs');
var asciitree = require('ascii-tree');
var str = fs.readFileSync('input.txt', 'utf8');
var tree = asciitree.generate(str);

//log the output
fs.writeFileSync('output.txt', tree, 'utf8');
console.log(fs.readFileSync('output.txt', 'utf8'));
