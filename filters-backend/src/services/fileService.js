const fs = require('fs');
const readData = (filePath) => {
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } 
    catch (err) { return []; }
};
const writeData = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
module.exports = { readData, writeData };