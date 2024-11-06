const { readDataFile } = require("./utils");
const { registerCommands } = require("./commands");
//helper script/function that automatically registers slash commands without kicking the bot out
(async () => {
    try {
        console.log('Registering slash commands...');
        //get all of the servers the bot is in
        let data = readDataFile();

        for(const obj of data) {
            registerCommands(obj.serverId);
        }
    } catch (error) {
        console.log(`There was an error in registeringCommands.js: ${error}`);
    }
})();