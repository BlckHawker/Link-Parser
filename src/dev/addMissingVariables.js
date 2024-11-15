const utils = require("../utils");
//helper script/function that automatically registers slash commands without kicking the bot out
(async () => {
    try {
        const data = utils.readDataFile();
        const newData = [];
            //todo for each object in data.json, check for missing information
            for(const object of data) {
                //if the serverId is missing, delete the object
                if(object.serverId === undefined) {
                    continue;
                }

                //allowedRoles
                if(object.allowedRoles === undefined) {
                    object.allowedRoles = [];
                }

                //allowedUsers
                if(object.allowedUsers === undefined) {
                    object.allowedUsers = [];
                }

                //todo enabled
                if(object.enabled === undefined) {
                    object.enabled = false;
                }

                newData.push(object);
            }

            utils.saveToDataFile(newData);


    } catch (error) {
        console.log(`There was an error in registeringCommands.js: ${error}`);
    }
})();