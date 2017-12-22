var shell = require('shelljs');

shell.cp('-R', 'server.js', 'dist/');
shell.cp('-R', 'src/public/img', 'dist/public/');
