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

//parses the link and returns the new link if valid. Returns undefined otherwise
const replaceLink = (str) => {
    const regexObjs = [
        {regex: /(https:\/\/www\.)tiktok\.com(\/t\/(?:.{9})\/)/i, callback: (arr) => {return `${arr[1]}vxtiktok.com${arr[2]}`}},
        {regex: /(https:\/\/www\.)tiktok\.com\/@(.+)\/video\/([0-9]{19})(?:\?.+)/i, callback: (arr) => {return `${arr[1]}vxtiktok.com/@${arr[2]}/video/${arr[3]}`}},
        {regex: /https:\/\/x\.com\/(.+)\/status\/([0-9]{19})(?:\?t=[a-zA-Z0-9_-]{22}&s=19)?/i, callback: (arr) => {return `https://fixupx.com/${arr[1]}/status/${arr[2]}`}}
    ]
    //check if any of the links are what we're looking for. If they are, parse into the new link and return it
    for(const regexObj of regexObjs) {
        const found = str.match(regexObj.regex)
        console.log(found)
        if(found !== null && found.input === found[0]) {
            return regexObj.callback(found);
        }
    }
}



module.exports = { saveToDataFile, readDataFile, replaceLink }