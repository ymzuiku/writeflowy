import fs from 'node:fs';

const inject = `
global.__dirname = __dirname;
global.__filename = __filename;
`;

const text = String(fs.readFileSync('./build/index.js'));
const nextText = inject + text;
fs.writeFileSync('./build/index.js', nextText);
