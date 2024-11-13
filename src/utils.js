const fs = require("fs");
const path = require("path");
const dataFileName = "../data.json";
require("dotenv").config();
const apiCalls = require("./apiCalls");

const saveToDataFile = (newObject) => {
  fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(newObject, null, 2), (err) => {
    if (err) return console.log(err);
  });
};

const readDataFile = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, dataFileName)));
};

//parses the link and returns the new link if valid. Returns undefined otherwise
const replaceLink = (str) => {
  //don't worry about messages that have spaces in them as they would imply they are something more than a link
  if (str.indexOf(" ") !== -1) {
    return undefined;
  }
  const regexObjs = [
    {
      regex: /(https:\/\/www\.)tiktok\.com(\/t\/(?:.{9})\/?)/i,
      callback: (arr) => {
        return `${arr[1]}vxtiktok.com${arr[2]}`;
      },
    },
    {
      regex: /(https:\/\/www\.)tiktok\.com\/@(.+)\/video\/([0-9]{19})\/?(?:\?.+)?/i,
      callback: (arr) => {
        return `${arr[1]}vxtiktok.com/@${arr[2]}/video/${arr[3]}/`;
      },
    },
    {
      regex: /(https:\/\/www\.)tiktok\.com\/@(.+)\/video\/([0-9]{19})\?is_from_webapp=(?:\d+)&sender_device=pc/i,
      callback: (arr) => {
        return `${arr[1]}vxtiktok.com/@${arr[2]}/video/${arr[3]}/`;
      },
    },
    {
      regex: /https:\/\/x\.com\/(.+)\/status\/([0-9]{19})(?:\?t=[a-zA-Z0-9_-]{22}&s=19)?/i,
      callback: (arr) => {
        return `https://fixupx.com/${arr[1]}/status/${arr[2]}`;
      },
    },
    {
      regex: /https:\/\/www\.instagram\.com\/p\/([A-Z0-9_]{11})\/\?img_index=(\d+)/i,
      callback: (arr) => {
        return `https://www.ddinstagram.com/p/${arr[1]}/?img_index=${arr[2]}`;
      },
    },
    {
      regex: /https:\/\/www\.instagram\.com\/p\/([A-Z0-9_]{11})\/(?:\?igsh=[A-Z0-9]{15, 18}={1,2})?/i,
      callback: (arr) => {
        return `https://www.ddinstagram.com/p/${arr[1]}/`;
      },
    },
    {
      regex: /https:\/\/www\.instagram\.com\/p\/([A-Z0-9_]{11})\/?/i,
      callback: (arr) => {
        return `https://www.ddinstagram.com/p/${arr[1]}/`;
      },
    },
    {
      regex: /https:\/\/www\.instagram\.com\/reel\/([A-Z0-9]{11})\/(?:\?igsh=[A-Z0-9]{15, 18}={1,2})?/i,
      callback: (arr) => {
        return `https://www.ddinstagram.com/reel/${arr[1]}/`;
      },
    },
  ];

  //check if any of the links are what we're looking for. If they are, parse into the new link and return it
  for (const regexObj of regexObjs) {
    const found = str.match(regexObj.regex);
    if (found !== null) {
      return regexObj.callback(found);
    }
  }
};

const createNewObject = (serverId) => {
  return { serverId, enabled: false, allowedRoles: [], allowedUsers: [] };
};

//todo make this a unit test
const updateObject = (oldObject, changeIndex, newValue) => {
  const newObject = structuredClone(oldObject);
  switch (changeIndex) {
    case 0: //enabled
      newObject.enabled = newValue;
      break;

    case 1: //allowedRoles
      newObject.allowedRoles = newValue;
      break;

    case 2: //allowedUsers
    newObject.allowedUsers = newValue;
      break;
  }
  return newObject;
};

//todo make this a unit test
//todo get all the names that can appear
const getAllowedRolesNames = async (serverId) => {
  const data = readDataFile();
  const serverObj = data.find((obj) => obj.serverId === serverId);
  const validRolesObj = await apiCalls.getServerRolesWithIds(serverObj.serverId, serverObj.allowedRoles);
  return validRolesObj.length == 0 ? [`- N/A`] : validRolesObj.map((obj) => `- **${obj.name}**`);
};

//todo make this a unit test
const getAllowedUserNames = async (serverId) => {
  const data = readDataFile();
  const serverObj = await apiCalls.getServer(serverId);
  const jsonServerObj = data.find((obj) => obj.serverId === serverId);
  const validUserIds = [serverObj.owner_id].concat(jsonServerObj.allowedUsers);
  const validUserObj = await apiCalls.getServerUsers(jsonServerObj.serverId, validUserIds);
  return validUserObj.map((obj, ix) => `- **${obj.user.username}**${ix == 0 ? " (the server owner)" : ""}`);
};

//checks if user is allowed to use (dis)enable the bot. True if any of the criteria are met
/*
* The server owner
* A whitelisted user
* Have at least one whitelisted role 
*/
const userIsAllowed = async (interaction) => {
  const serverId = interaction.channel.guild.id;
  const data = readDataFile();
  const serverObj = data.find((obj) => obj.serverId === serverId);
  return interaction.guild.ownerId == interaction.user.id ||
  interaction.member.roles.cache.some((role) => serverObj.allowedRoles.includes(role.id)) ||
  serverObj.allowedUsers.includes(interaction.user.id)

        

};

module.exports = { saveToDataFile, readDataFile, replaceLink, createNewObject, updateObject, getAllowedRolesNames, getAllowedUserNames, userIsAllowed };
