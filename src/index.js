require("dotenv").config();
const utils = require("./utils");
const commands = require("./commands");
const apiCalls = require('./apiCalls')
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildPresences],
});

client.on("ready", (c) => {
  console.log(`${c.user.tag} is online`);
});

client.on("messageCreate", async (message) => {
  //if any of the following is true, don't do anything
  /** message came from a bot
   * message content is empty
   * the bot is disabled in the sever */

  const serverId = message.channel.guild.id;
  let data = utils.readDataFile();
  const serverObj = data.find((obj) => obj.serverId === serverId);
  if (message.author.bot || !message.content || !serverObj.enabled) {
    return;
  }

  const found = utils.replaceLink(message.content)
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
  let data = utils.readDataFile();
  data.push(utils.createNewObject(guild.id));
  utils.saveToDataFile(data);

  //register commands
  commands.registerCommands(guild.id);
});

client.on("guildDelete", (guild) => {
  //when the bot leaves the server, remove from data json
  let data = utils.readDataFile();
  data = data.filter((obj) => obj.serverId !== guild.id);
  utils.saveToDataFile(data);
});

client.on('guildMemberRemove', (member) => {
  //a user is removed from a server, verify that it's not in "allowedUsers" for that server
  const userId = member.id;
  const serverId = member.guild.id;
  let data = utils.readDataFile();
  const serverObj = data.find((obj) => obj.serverId === serverId);
  data = data.filter((obj) => obj.serverId !== serverId);

  if(serverObj.allowedUsers.includes(userId)) {
    const newUsers = serverObj.allowedUsers.filter(id => id !== userId);
    const newObj = utils.updateObject(serverObj, 2, newUsers);
    data.push(newObj);
  }

  else {
    data.push(serverObj);
  }

  utils.saveToDataFile(data);
});

client.on("roleDelete", (role) => {
  //when a role is removed from a server, verify that it's not in "allowedRoles" for that server
  const roleId = role.id;
  const serverId = role.guild.id;
  let data = utils.readDataFile();
  const serverObj = data.find((obj) => obj.serverId === serverId);
  data = data.filter((obj) => obj.serverId !== serverId);
  if(serverObj.allowedRoles.includes(roleId)) {
    const newRoles = serverObj.allowedRoles.filter(id => id !== roleId);
    const newObj = utils.updateObject(serverObj, 1, newRoles);
    data.push(newObj);
  }

  else {
    data.push(serverObj);
  }

  utils.saveToDataFile(data);
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  await commands.handleCommand(interaction);
});

client.login(process.env.DISCORD_TOKEN);
