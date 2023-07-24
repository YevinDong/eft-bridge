const shell = require("shelljs");
const ls = shell.ls()
ls.includes('public') && havePublic && shell.cp("-rf", './public', './lib/public');

