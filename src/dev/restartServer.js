const { saveToDataFile, readDataFile, replaceLink, createNewObject } = require("../utils");
(async () => {
    const restartAllServers = false;
    const serverId = '1302773269018968115';

    try {
        let data = readDataFile();

        //if restartAllServers is true, restart all servers (shocker)
        if(restartAllServers) {
            data = data.map(obj => createNewObject(obj.serverId));
            saveToDataFile(data);
        }

        else {
            const obj = data.find(obj => obj.serverId == serverId);
            
            //if the server is not in data, make a new object
            if(!obj) {
                data.push(createNewObject(serverId))
                saveToDataFile(data);
            }

            //otherwise, update the object
            else {
                data = data.filter(obj => obj.serverId != serverId);
                const newObj = createNewObject(serverId);
                data.push(newObj);
                saveToDataFile(data);
            }
        }
    } 
    catch (error) {
        console.log(`There was an error in restartServer.js: ${error}`);
    }
})();