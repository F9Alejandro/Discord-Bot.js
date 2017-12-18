var fs = require('fs');
var check = require('syntax-error');
var file = __dirname + '/plugins/Multi\ Stream/stream.js';
var src = fs.readFileSync(file);

var err = check(src, file);
if (err) {
    console.error(Array(62).join('!'));
    console.error('ERROR DETECTED');
    console.error(err);
    console.error(Array(76).join('_'));
}
