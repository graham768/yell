#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn;
const tmp = require('tmp');
const fs = require('fs');

var yellMe = process.argv[2];
var domain = process.argv[3];

if(yellMe == null){
  return console.log("hey you have to yell something..");
}

var html = `
<!DOCTYPE html>
<html>
<head>
  <title>${yellMe}</title>
  <style>
    p{
      font-size: ${Math.max(100/yellMe.length, 20)}vw;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <p>${yellMe}</p>
</body>
</html> 
`

const tmpdir = tmp.dirSync();
const tmpobj = tmp.fileSync({ dir: tmpdir.name, name: 'index.html' });

fs.writeFile(tmpobj.name, html, function (err) {
  if (err) return console.log(err);

  var surgeArgs = [ tmpdir.name ];
  if(domain) surgeArgs.push(domain);

  const child = spawn( 'surge', surgeArgs);

  child.stdin.setEncoding('utf-8');
  child.stdout.pipe(process.stdout);

  child.stdin.write("\n");

  child.stdin.end();
})