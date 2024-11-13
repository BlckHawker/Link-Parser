const utils = require("../utils");
(async () => {
    const restartAllServers = false;
    const serverId = '1302773269018968115';

    try {
        let data = utils.readDataFile();

        //if restartAllServers is true, restart all servers (shocker)
        if(restartAllServers) {
            data = data.map(obj => utils.createNewObject(obj.serverId));
            utils.saveToDataFile(data);
        }

        else {
            const obj = data.find(obj => obj.serverId == serverId);
            
            //if the server is not in data, make a new object
            if(!obj) {
                data.push(utils.createNewObject(serverId))
                saveToDataFile(data);
            }

            //otherwise, update the object
            else {
                data = data.filter(obj => obj.serverId != serverId);
                const newObj = utils.createNewObject(serverId);
                data.push(newObj);
                saveToDataFile(data);
            }
        }
    } 
    catch (error) {
        console.log(`There was an error in restartServer.js: ${error}`);
    }
})();