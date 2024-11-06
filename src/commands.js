const { saveToDataFile, readDataFile } = require('./utils');
const { REST, Routes, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const setEnabledCommandName = 'set-enabled';
const viewEnabledCommandName = 'view-enabled';

//registers all the commands in a specific server
const registerCommands = (serverId) => {
  const commands = [
    {
      name: 'help',
      description: 'See what the purpose of this bot is'
    },
    {
      name: setEnabledCommandName,
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
      name: viewEnabledCommandName,
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

      console.log(`Slash commands were registered successfully in server id ${serverId}`);
    } catch (error) {
      console.log(`There was an error in server id ${serverId}: ${error}`);
    }
  })();
}

const handleCommand = (interaction) => {
  let data = readDataFile();
  const serverId = interaction.channel.guild.id;
  const serverObj = data.find(obj => obj.serverId === serverId);

  switch (interaction.commandName) {
    case 'help':

      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Commands')
        .setDescription(`- **/${setEnabledCommandName}** - Enable the bot. Needs to be done in order for it to work\n- **/${viewEnabledCommandName}** - view if the bot is enabled`)
      interaction.reply({ content: `Have you ever been sent a link from twitter/instagram/tiktok and were forced to login in or redirected to the app/site order to see the content? There are some "link fixers" where you can edit the url in order for it to appear in discord, but it can be annoying to remember them all. This bot cuts out you needing to edit the link by deleting your original message and reposting the message with the fixed link. It will then "ping" you as the original poster. (It doesn't actually ping you as it edits the message to add the mention).`, ephemeral: true, embeds: [embed]  })
      break
    case setEnabledCommandName:
      const newValue = interaction.options.get('value').value;

      //if the new value is the same as the old one send a message saying it's redundant
      if (serverObj.enabled === newValue) {
        interaction.reply({ content: `The bot is already ${newValue ? 'enabled' : 'disabled'}`, ephemeral: true })
      }

      //update the value, and send a message
      else {
        data = data.filter(obj => obj.serverId !== serverId);
        data.push({ serverId: serverId, "enabled": newValue });
        saveToDataFile(data);
        interaction.reply({ content: `The bot is now ${newValue ? 'enabled' : 'disabled'}`, ephemeral: true })
      }
      break;
    case 'view-enabled':
      //tell the user if the bot is enabled in this server
      interaction.reply({ content: `The bot is ${serverObj.enabled ? 'enabled' : 'disabled'}`, ephemeral: true })
      break;
  }
}

module.exports = { registerCommands, handleCommand }