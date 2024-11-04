require("dotenv").config();
const { saveToDataFile, readDataFile } = require('./utils');
const { registerCommands } = require('./commands');
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }

  //if the message doesn't have any content (like a pin), don't send anything
  if (!message.content) {
    return;
  }

  message.channel.send(message.content);
});

client.on("guildCreate", (guild) => {

  //When the bot joins a server, 
  //create a new object with the server id saved and "enabled" being set to false
  let data = readDataFile();
  data.push({ serverId: guild.id, enabled: false })
  saveToDataFile(data);

  //register commands
  registerCommands(guild.id);
});

client.on("guildDelete", (guild) => {
  //when the bot leaves the server, remove from data json
  let data = readDataFile();
  data = data.filter((obj) => obj.serverId !== guild.id);
  saveToDataFile(data);
});

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand())
        return;

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
})

client.login(process.env.DISCORD_TOKEN);
