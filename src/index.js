require("dotenv").config();
const { saveToDataFile, readDataFile, replaceLink } = require("./utils");
const { registerCommands, handleCommand } = require("./commands");
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online`);
});

client.on("messageCreate", async (message) => {
  //todo if any of the following is true, don't do anything
  /** message came from a bot
   * message content is empty
   * the bot is disabled in the sever */

  const serverId = message.channel.guild.id;
  let data = readDataFile();
  const serverObj = data.find((obj) => obj.serverId === serverId);
  if (message.author.bot || !message.content || !serverObj.enabled) {
    return;
  }

  const found = replaceLink(message.content)
  if (found === undefined) {
    return;
  }

  //delete the original message
  message.delete();

  //send the message
  const newMessage = await message.channel.send(found);

  //update the message so it updates the user
  newMessage.edit(`${newMessage.content} sent by <@${message.author.id}>`)

});

client.on("guildCreate", (guild) => {
  //When the bot joins a server,
  //create a new object with the server id saved and "enabled" being set to false
  let data = readDataFile();
  data.push({ serverId: guild.id, enabled: false });
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

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  handleCommand(interaction);
});

client.login(process.env.DISCORD_TOKEN);
