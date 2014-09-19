#!/usr/bin/env node

var fs = require('fs-extra');
var colors = require('colors');

var target = process.argv[2];

fs.readFile(target, 'utf-8', function(err, data) {
  if (err) {
    console.log(('ERROR: Can\'t read ' + target.underline).red);
  } else {
    var content,
        newFiles = [],
        syntax   = target.split('.').slice(-1)[0];

    // get rid of comments
    content = data.replace(/\/\*.*\*\//g, '').replace(/\/\/.*(\n|$\n?)/g, '');
    // get @import expression
    content = content.match(/@import\s.+(;|\n|$\n?)/g).toString();
    // get imported file name
    content = content.match(/(?!="|')[\w-.\/]+(?="|')/g);


    content.forEach(function(file) {
      var newFile,
          extension = file.slice(-5);

      if (extension == '.sass' || extension == '.scss' || extension == '.less') {
        newFile = file;
      } else {
        newFile = file + '.' + syntax;
      }

      if (!fs.existsSync(newFile)) {
        fs.createFileSync(newFile);
        newFiles.push(newFile);
      }
    });


    if (newFiles.length) {
      console.log(('Created ' + newFiles.length + ' file(s):\n').green + newFiles.join('\n'));
    } else {
      console.log('No new files to create.'.grey);
    }
  }
});
