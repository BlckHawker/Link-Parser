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

module.exports = { registerCommands }