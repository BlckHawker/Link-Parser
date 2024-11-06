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
    //don't worry about messages that have spaces in them as they would imply they are something more than a link
    if(str.indexOf(' ') !== -1) {
        return undefined;
    }
    const regexObjs = [
        {regex: /(https:\/\/www\.)tiktok\.com(\/t\/(?:.{9})\/)/i, callback: (arr) => {return `${arr[1]}vxtiktok.com${arr[2]}`}},
        {regex: /(https:\/\/www\.)tiktok\.com\/@(.+)\/video\/([0-9]{19})(?:\?.+)/i, callback: (arr) => {return `${arr[1]}vxtiktok.com/@${arr[2]}/video/${arr[3]}`}},
        {regex: /https:\/\/x\.com\/(.+)\/status\/([0-9]{19})(?:\?t=[a-zA-Z0-9_-]{22}&s=19)?/i, callback: (arr) => {return `https://fixupx.com/${arr[1]}/status/${arr[2]}`}},
        {regex: /https:\/\/www\.instagram\.com\/p\/([A-Z0-9]{11})\/(?:\?igsh=[A-Z0-9]{15, 18}={1,2})?/i, callback: (arr) => {return `https://www.ddinstagram.com/p/${arr[1]}/`}},
        {regex: /https:\/\/www\.instagram\.com\/reel\/([A-Z0-9]{11})\/(?:\?igsh=[A-Z0-9]{15, 18}={1,2})?/i, callback: (arr) => {return `https://www.ddinstagram.com/reel/${arr[1]}/`}},
    ]

    //check if any of the links are what we're looking for. If they are, parse into the new link and return it
    for(const regexObj of regexObjs) {
        const found = str.match(regexObj.regex)
        console.log(found)
        if(found !== null) {
            console.log('found object')
            return regexObj.callback(found);
            
        }
    }
}



module.exports = { saveToDataFile, readDataFile, replaceLink }