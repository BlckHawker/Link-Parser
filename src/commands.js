const utils = require("./utils");
const { getServerUsers, getServerRoles } = require("./apiCalls");

const { REST, Routes, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const apiCalls = require("./apiCalls");
const setEnabledCommandName = "toggle-bot";
const viewEnabledCommandName = "view-enabled";
const enablePersonRole = "allow-enable";
const disablePersonRole = "disallow-enable"
const viewEnableUserRoles = "view-enabled-users";

//registers all the commands in a specific server
const registerCommands = (serverId) => {
  let userIsAllowed;

  const commands = [
    {
      name: "help",
      description: "See what the purpose of this bot is",
    },
    {
      name: setEnabledCommandName,
      description: "Change if the bot is enabled",
      options: [
        {
          name: "value",
          description: "Set the if the bot is enabled",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
      ],
    },
    {
      name: viewEnabledCommandName,
      description: "See if the bot is enabled",
    },
    {
      name: enablePersonRole,
      description: "Allows a specific user or role to enable/disable the bot. Requires role **OR** user option",
      options: [
        {
          name: "user",
          description: "The user who will be allowed to enable/disable the bot",
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "role",
          description: "The role that will be allowed to enable/disable the bot",
          type: ApplicationCommandOptionType.Role,
        },
      ],
    },
    {
      name: viewEnableUserRoles,
      description: `View who is able to use the "/${setEnabledCommandName}" command`
    },
    {
      name: disablePersonRole,
      description: "Remove a specific user or role from of enabling/disabling the bot. Requires role **OR** user option",
      options: [
        {
          name: "user",
          description: "The user who will be be removed from enabling/disabling the bot",
          type: ApplicationCommandOptionType.User,
        },
        {
          name: "role",
          description: "The role that will be be removed from enabling/disabling the bot",
          type: ApplicationCommandOptionType.Role,
        },
      ],
    }
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  (async () => {
    try {
      console.log(`Registering slash commands in server id ${serverId}...`);

      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, serverId), { body: commands });

      console.log(`Slash commands were registered successfully in server id ${serverId}`);
    } catch (error) {
      console.log(`There was an error in server id ${serverId}: ${error}`);
    }
  })();
};

const handleCommand = async (interaction) => {
  const testServerId = '1302773269018968115'
  let data = utils.readDataFile();
  const serverId = interaction.channel.guild.id;
  const serverObj = data.find((obj) => obj.serverId === serverId);
  let targetUser;
  let targetRole;

  switch (interaction.commandName) {
    case "help":
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Commands")
        .setDescription(`- **/${setEnabledCommandName}** - Toggle the enability of the bot. Needs to be done in order for it to work\n- **/${viewEnabledCommandName}** - view if the bot is enabled\n- **/${viewEnableUserRoles}** - see who is allowed to use the **/${setEnabledCommandName}** command\n- **/${enablePersonRole}** - whitelists a certain user/role to use the **/${setEnabledCommandName}** command. **(Only the server owner can use this)**\n - **/${disablePersonRole}** - remove a certain user/role from the whitelist to use the **/${setEnabledCommandName}** command. **(Only the server owner can use this)**` );
      interaction.reply({
        content: `Have you ever been sent a link from twitter/instagram/tiktok and were forced to login in or redirected to the app/site order to see the content? There are some "link fixers" where you can edit the url in order for it to appear in discord, but it can be annoying to remember them all. This bot cuts out you needing to edit the link by deleting your original message and reposting the message with the fixed link. It will then "ping" you as the original poster. (It doesn't actually ping you as it edits the message to add the mention).\n\n If you see a bug please report them as a issue on github [here](https://github.com/BlckHawker/Link-Parser/issues). ${testServerId === serverId ? `Since you are in the test server, you can also make report in bug reports. Please do not report in both places as that will cause confusion.` : ""}`,
        ephemeral: true,
        embeds: [embed],
      });
      break;
    case setEnabledCommandName:
      //check if the user is allowed to run this command
      userIsAllowed = await utils.userIsAllowed(interaction, serverId);

      if (!userIsAllowed) {
        //get the users who can enable/disable the bot
        const allowedUsers = await utils.getAllowedUserNames(serverId);

        //get the roles who can enable/disable the bot
        const allowedRoles = await utils.getAllowedRolesNames(serverId);

        interaction.reply({
          content: getListMessage(utils.userIsAllowed, allowedUsers, allowedRoles),
          ephemeral: true,
        });
        return;
      }

      const newValue = interaction.options.get("value").value;

      //if the new value is the same as the old one send a message saying it's redundant
      if (serverObj.enabled === newValue) {
        interaction.reply({ content: `The bot is already ${newValue ? "enabled" : "disabled"}`, ephemeral: true });
      }

      //update the value, and send a message
      else {
        const newObject = utils.updateObject(serverObj, 0, newValue);
        data = data.filter((obj) => obj.serverId !== serverId);
        data.push(newObject);
        utils.saveToDataFile(data);
        interaction.reply({ content: `The bot is now ${newValue ? "enabled" : "disabled"}`, ephemeral: true });
      }
      break;
    case viewEnabledCommandName:
      //tell the user if the bot is enabled in this server
      interaction.reply({ content: `The bot is ${serverObj.enabled ? "enabled" : "disabled"}`, ephemeral: true });
      break;

    case enablePersonRole:
      //todo redo all of the testing about allow/removing a user/role
      //if the person who used this command isn't the server owner, send a warning
      //todo test this with someone
      if (interaction.channel.guild.ownerId !== interaction.guild.ownerId) {
        interaction.reply({ content: `Only the server owner can run this command`, ephemeral: true });
        return;
      }

      //get the options
      targetUser = interaction.options.get("user")?.value;
      targetRole = interaction.options.get("role")?.value;


      //if both options are given, send a waring
      if (targetUser !== undefined && targetRole !== undefined) {
        interaction.reply({ content: `Need either the user or role. Can't give both`, ephemeral: true });
        return;
      }

      //if neither option is given, send a warning
      if (targetUser === undefined && targetRole === undefined) {
        interaction.reply({ content: `You did not provide either the user or role.`, ephemeral: true });
        return;
      }

      if (targetUser !== undefined) {
        //if the target user is the server owner, send a warning
        if (targetUser === interaction.channel.guild.ownerId) {
          interaction.reply({ content: `The sever owner already is allowed to use **/${setEnabledCommandName}**`, ephemeral: true });
          return;
        }
        const userObj = await apiCalls.getServerUser(serverId, targetUser);
        //if the desired user is already added, send a warning
        if (serverObj.allowedUsers.includes(targetUser)) {
          interaction.reply({ content: `**${userObj.user.username}** is already allowed to use the **/${setEnabledCommandName}** command`, ephemeral: true });
          return;
        }

        //add the desired user to the appropriate array, and send a message
        else {
          const newObject = utils.updateObject(serverObj, 2, [targetUser].concat(serverObj.allowedUsers));
          data = data.filter((obj) => obj.serverId !== serverId);
          data.push(newObject);
          utils.saveToDataFile(data);
          interaction.reply({ content: `**${userObj.user.username}** is now allowed to use the **/${setEnabledCommandName}** command`, ephemeral: true })
          return;
        }

      }

      else {
        const roleObj = await apiCalls.getServerRoleId(serverId, targetRole);

        //if the role is @everyone, send a warning
        if(roleObj.name === "@everyone") {
          interaction.reply({ content: `Cant't allow @everyone to use the **/${setEnabledCommandName}** command`, ephemeral: true });
          return;
        }
        //if the desired role is already added, send a warning
        if (serverObj.allowedRoles.includes(targetRole)) {
          interaction.reply({ content: `Role **${roleObj.name}** is already allowed to use the **/${setEnabledCommandName}** command`, ephemeral: true });
          return;
        }

        //add the desired role to the appropriate array, and send a message
        else {
          const newObject = utils.updateObject(serverObj, 1, [targetRole].concat(serverObj.allowedRoles));
          data = data.filter((obj) => obj.serverId !== serverId);
          data.push(newObject);
          utils.saveToDataFile(data);
          interaction.reply({ content: `Role **${roleObj.name}** is now allowed to use the **/${setEnabledCommandName}** command`, ephemeral: true })
          return;
        }
      }
      break;

    case disablePersonRole:
      //only the server owner is allowed to use this command
      if (interaction.channel.guild.ownerId !== interaction.guild.ownerId) {
        interaction.reply({ content: `Only the server owner can run this command`, ephemeral: true });
        return;
      }

      //get the options
      targetUser = interaction.options.get("user")?.value;
      targetRole = interaction.options.get("role")?.value;

      //if both options are given, send a waring
      if (targetUser !== undefined && targetRole !== undefined) {
        interaction.reply({ content: `Need either the user or role. Can't give both`, ephemeral: true });
        return;
      }

      //if neither option is given, send a warning
      if (targetUser === undefined && targetRole === undefined) {
        interaction.reply({ content: `You did not provide either the user or role.`, ephemeral: true });
        return;
      }

      if(targetUser !== undefined) {
        const userObj = await apiCalls.getServerUser(serverId, targetUser);
        //if the user is not on the list, send a warning
        if(!serverObj.allowedUsers.includes(targetUser)) {
          interaction.reply({ content: `**${userObj.user.username}** is already not allowed to use the **/${setEnabledCommandName}** command`, ephemeral: true });
          return;
        }

        //remove the user from the list
        else {
          const newList = serverObj.allowedUsers.filter(id => id != targetUser);
          const newObject = utils.updateObject(serverObj, 2, newList);
          data = data.filter((obj) => obj.serverId !== serverId);
          data.push(newObject);
          utils.saveToDataFile(data);
          interaction.reply({ content: `**${userObj.user.username}** is now unable to use the **/${setEnabledCommandName}** command`, ephemeral: true })
          return;
        }
      }

      else {
        //todo if the role is not on the list, send a warning
        const roleObj = await apiCalls.getServerRoleId(serverId, targetRole);

        //if the desired role is already added, send a warning
        if (!serverObj.allowedRoles.includes(targetRole)) {
          interaction.reply({ content: `Role **${roleObj.name}** is already not allowed to use the **/${setEnabledCommandName}** command`, ephemeral: true });
          return;
        }

        //todo remove the role from the list
        else {
          const newList = serverObj.allowedRoles.filter(id => id != targetRole);
          const newObject = utils.updateObject(serverObj, 2, newList);
          data = data.filter((obj) => obj.serverId !== serverId);
          data.push(newObject);
          utils.saveToDataFile(data);
          interaction.reply({ content: `Role **${roleObj.name}** is now unable to use the **/${setEnabledCommandName}** command`, ephemeral: true })
          return;
        }
      }

      

      break;
    case viewEnableUserRoles:
      //get the users who can enable/disable the bot
      const allowedUsers = await utils.getAllowedUserNames(serverId);

      //get the roles who can enable/disable the bot
      const allowedRoles = await utils.getAllowedRolesNames(serverId);

      userIsAllowed = await utils.userIsAllowed(interaction, serverId);

      interaction.reply({ content: getListMessage(userIsAllowed, allowedUsers, allowedRoles), ephemeral: true });
      break;
  }
};

const getListMessage = (userIsAllowed, allowedUsers, allowedRoles) => {
  return `You ${!userIsAllowed ? "do not " : ""}have permissions to run **/${setEnabledCommandName}**. Here is a full list of people are ${userIsAllowed ? "also " : ""}able to run it:\n### Users\n${allowedUsers.join("\n")}\n### Roles\n${allowedRoles.join("\n")}${!userIsAllowed ? "\n\nContact the server owner to give you permission " : ""}`
}

module.exports = { registerCommands, handleCommand };
