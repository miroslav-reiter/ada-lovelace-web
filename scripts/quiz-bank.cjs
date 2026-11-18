// Extract the site's own translated question literals without running its DOM code.
const fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(process.argv[2],'utf8');
const reference=code.match(/const reference = (\{[\s\S]*?\n  \});/)[1];
const questions=code.match(/const questions = (\[[\s\S]*?\n    \]);/)[1];
process.stdout.write(JSON.stringify(vm.runInNewContext(`const reference=${reference}; (${questions})`,{}, {timeout:1000})));
