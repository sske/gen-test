const argv = process.argv;
console.log(argv);

if (argv.length < 3) {
  console.log('args filename');
  return;
}

const fileName = argv[3];

const fs = require('fs');
const XLSX = require('xlsx');
const Utils = XLSX.utils;

let result = [];

const conf = JSON.parse(fs.readFileSync('def.conf.json', 'utf8'));

const book = XLSX.readFile('generate.xls');
const sheet = book.Sheets[conf.sheet.name];

let lineNo = conf.line.start;
let permSpace = conf.line.permspace;

let countSpace = 0;
while (countSpace < permSpace) {
  const idCell = sheet[conf.row.id + lineNo];
  const nameCell = sheet[conf.row.name + lineNo];
  const reqCell = sheet[conf.row.req + lineNo];
  const maxCell = sheet[conf.row.max + lineNo];

  lineNo++;
  if (!idCell) {
    countSpace++;
    continue;
  }

  let data = {
    base: {}
  };

  if (idCell) { data.base.no = idCell.v }
  if (nameCell) { data.base.name = nameCell.v }
  if (reqCell) { data.base.req = !!reqCell.v }
  if (maxCell) { data.base.max = maxCell.v }

  result.push(data);
}

fs.writeFile('hoge.json', JSON.stringify(result, null, '  '));
