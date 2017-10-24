// const argv = process.argv;
// console.log(argv);
//
// if (argv.length < 3) {
//   console.log('args filename');
//   return;
// }
//
// const fileName = argv[2];
// console.log(fileName);
//
// const fs = require('fs');
// const XLSX = require('xlsx');
// const Utils = XLSX.utils;
//
// let result = [];
//
// const conf = JSON.parse(fs.readFileSync('def.conf.json', 'utf8'));
//
// const book = XLSX.readFile(fileName);
// const sheet = book.Sheets[conf.sheet.name];
//
// let lineNo = conf.line.start;
// let permSpace = conf.line.permspace;
//
// let countSpace = 0;
// while (countSpace < permSpace) {
//   const idCell = sheet[conf.row.id + lineNo];
//   const nameCell = sheet[conf.row.name + lineNo];
//   const reqCell = sheet[conf.row.req + lineNo];
//   const maxCell = sheet[conf.row.max + lineNo];
//
//   lineNo++;
//   if (!idCell) {
//     countSpace++;
//     continue;
//   }
//
//   let data = {
//     base: {}
//   };
//
//   if (idCell) { data.base.no = idCell.v }
//   if (nameCell) { data.base.name = nameCell.v }
//   if (reqCell) { data.base.req = !!reqCell.v }
//   if (maxCell) { data.base.max = maxCell.v }
//
//   result.push(data);
// }
//
// fs.writeFile('hoge.json', JSON.stringify(result, null, '  '));


//require
var chokidar = require("chokidar");
var fs = require("fs");
var path = require("path");

var fileContents = {};
var baseDirectory = './log';
var targetFiles = ['a.log', 'b.log'];
var filePaths = [];

var fileSizes = {};
targetFiles.forEach(p => {
  var target = path.join(baseDirectory, p);
  filePaths.push(target);
  try {
    var s = fs.statSync(target);
    fileSizes[p] = s.size;
  } catch (e) {
    fileSizes[p] = 0;
  }
});

var getTargetFileName = function(dp) {
  var fileName;
  targetFiles.some(p => {
    if (dp.indexOf(p) > -1) {
      fileName = p;
      return true;
    }
  });
  return fileName;
};


//chokidarの初期化
var watcher = chokidar.watch(filePaths, {
  ignored: /[\/\\]\./,
  persistent: true
});

//イベント定義
watcher.on('ready', () => {
  watcher.on('add', (p, s) => {
    fileSizes[p] = s.size;
  }).on('change', function(p, s) {
    var fn = getTargetFileName(p);
    fs.open(p, 'r', (err, fd) => {
      return fs.read(fd, s.size, fileSizes[fn], 'utf-8', (e, l, b) => {
        fileSizes[fn] = s.size;
        if (!fileContents[fn]) {
          fileContents[fn] = '';
        }
        fileContents[fn] += l;
        console.log(fileContents);
        fs.close(fd);
      });
    });
  });
});
