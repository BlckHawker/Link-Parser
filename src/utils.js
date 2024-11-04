const fs = require('fs');
const path = require("path");
const dataFileName = "../data.json";
require('dotenv').config();

const saveToDataFile = (newObject) => {
    fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(newObject, null, 2), (err) => {
        if (err) return console.log(err);
      });
}

const readDataFile = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, dataFileName)))
}



module.exports = { saveToDataFile, readDataFile }