const { saveToDataFile, readDataFile, updateObject } = require('./utils');
const { REST, Routes, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const setEnabledCommandName = 'set-enabled';
const viewEnabledCommandName = 'view-enabled';
const enablePersonRole = 'allow-enable'


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
    {
      name: enablePersonRole,
      description: 'Only the server owner can use this command. Allows a specific user or role to enable/disable the bot. Requires role **OR** user option',
      options: [
        {
          name: 'user',
          description: 'The user who will be allowed to enable/disable the bot',
          type: ApplicationCommandOptionType.User,
        },
        {
          name: 'role',
          description: 'The role who will be allowed to enable/disable the bot',
          type: ApplicationCommandOptionType.Role,
        },
      ]
    }
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
        const newObject = updateObject(data.find(obj => obj.serverId === serverId));
        data = data.filter(obj => obj.serverId !== serverId);
        data.push(newObject)
        saveToDataFile(data);
        interaction.reply({ content: `The bot is now ${newValue ? 'enabled' : 'disabled'}`, ephemeral: true })
      }
      break;
    case viewEnabledCommandName:
      //tell the user if the bot is enabled in this server
      interaction.reply({ content: `The bot is ${serverObj.enabled ? 'enabled' : 'disabled'}`, ephemeral: true })
      break;

    case enablePersonRole:

      //todo if the person who used this command isn't the server owner, send a warning

      //todo get the options

      //todo if both options are given, send a waring

      //todo if neither option is given, send a warning

      //todo if the desired user/role is already added, send a warning

      //todo add the desired role/user to the appropriate array, and send a message
      break;
  }
}

module.exports = { registerCommands, handleCommand }