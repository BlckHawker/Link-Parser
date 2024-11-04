const { saveToDataFile, readDataFile } = require('./utils');
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
//registers all the commands in a specific server
const registerCommands = (serverId) => {

    const commands = [
        {
          name: 'set-enabled',
          description: 'Change if the bot is enabled',
          options: [
            {
                name: 'value',
                description: 'Set the if the bot is enabled',
                type: ApplicationCommandOptionType.Boolean,
                required: true
            }
          ]
        },
        {
          name: 'view-enabled',
          description: 'See if the bot is enabled',
        },
      ];

      const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

      (async () => {
        try {
          console.log(`Registering slash commands in server id ${serverId}...`);
      
          await rest.put(
            Routes.applicationGuildCommands(
              process.env.CLIENT_ID,
              serverId
            ),
            { body: commands }
          );
      
          console.log('Slash commands were registered successfully!');
        } catch (error) {
          console.log(`There was an error: ${error}`);
        }
      })();
}

const handleCommand = (interaction) => {
    let data = readDataFile();
    const serverId = interaction.channel.guild.id;
    const serverObj = data.find(obj => obj.serverId === serverId);

    switch(interaction.commandName)
    {
        case 'set-enabled':
            const newValue = interaction.options.get('value').value;

            //if the new value is the same as the old one send a message saying it's redundant
            if(serverObj.enabled === newValue) {
                interaction.reply({content:`The bot is already ${newValue ? 'enabled' : 'disabled'}`, ephemeral: true})
            }

            //update the value, and send a message
            else {
                data = data.filter(obj => obj.serverId !== serverId);
                data.push({serverId: serverId, "enabled": newValue});
                saveToDataFile(data);
                interaction.reply({content:`The bot is now ${newValue ? 'enabled' : 'disabled'}`, ephemeral: true})
            }
        break;
        case 'view-enabled':
            //tell the user if the bot is enabled in this server
            interaction.reply({content:`The bot is ${serverObj.enabled ? 'enabled' : 'disabled'}`, ephemeral: true})
        break;
    }
}

module.exports = { registerCommands, handleCommand }