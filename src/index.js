require("dotenv").config();
const { saveToDataFile, readDataFile } = require('./utils');
const { registerCommands, handleCommand } = require('./commands');
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

    handleCommand(interaction);
})

client.login(process.env.DISCORD_TOKEN);
