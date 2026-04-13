const fs = require('fs');
const path = 'src/lib/data.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/locationUrl: "([^"]+)", "([^"]+)",/g, 'locationUrl: "$1",');
code = code.replace(/locationUrl: "([^"]+)", "([^"]+)"/g, 'locationUrl: "$1"');

fs.writeFileSync(path, code);
