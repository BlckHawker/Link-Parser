## Description
Many people who use Discord send links from external sites.  Though some sites may force the user to log in to see the content, which may just be a few lines of text or a short video. There are "fixer links" such as `fixupx` and `vxtiktok` which allows the content to be seen in discord without needing to log in or even click on the link.

It can be annoying to remember all the fixer links, especially since they may not be supported anymore. This bot cuts out the user needing to edit links by sending the "fixed" link whenever someone sends a support list.

Here is a list of all the sites that are supported and the bot will look out for
- Twitter/X
- Tiktok
- Instagram


##  Demonstration

[Video Explaination](https://youtu.be/GmQVyxlycBU?t=453)

![Bot example gif](https://github.com/user-attachments/assets/d2ce7aa3-273e-4b5e-b0f1-f4ebcd03b0cc)


## Install
These are steps for develoeprs who want to contribute to the bot. Please send an issue and we'll have a conversasion of your idea and if it fits the purpose of the bot. If/When you have a pr ready, please target the `develop` branch and **not** `master`.

### 1. Install packages
Use `npm i` or `npm install` to add the missing pacakges

The bot has the following depencies
- `discord.js` v 14.16.3
- `dotenv` v 16.4.5
- `jest` v 29.7.0

### 2. Create .env
-  Duplicate the file `example.env` and rename the copy `.env`
-  Add the missing variables
    -  `DISCORD_TOKEN`: the token of the bot
    -  `CLIENT_ID`: the id of the bot

### 3. Familarize yourself with the command
There are a few scripts defined in `package.json` to stream line to process. Each can be used by running `npm run x` with `x` being the command name.
<table>
    <tr>
        <th>
            Name
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>register</td>
        <td>Register all the slash commands</td>
    </tr>
    <tr>
        <td>restart</td>
        <td>Either restarts all or one server's settings back to the default values</td>
    </tr>
    <tr>
        <td>missing-variables</td>
        <td>If a server is missing a setting, it will be added with the default value</td>
    </tr>
</table>

### 5. Run bot
Use `node src\index.js` to run the bot

### 4. Create Unit tests (if applicable)
Unit tests are created to verify the bot is correctly detecting links. Though they can be used in other causes as well. Please add them in `tests` folder if your additional is applicable. Run the tests using `npm test`.

## Slash Commands
These are the slash commands that the bot handles
| **Name**            | **Description**                                                                                                    | **Notes**                                                                                                                               |
|---------------------|--------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| /help               | Gives a brief description of the bot and describes what each slash command works.                                  |                                                                                                                                         |
| /toggle-bot         | enables/disables the bot. If the bot is disabled, then the bot will not send a message when a target link is sent. | `value`: If true, the bot will be enabled. Otherwise, it will be disabled.                                                              |
| /view-enabled-users | View who is able to use the **/toggle-bot** command                                                                |                                                                                                                                         |
| /allow-enable       | Allows a specific user or role to enable/disable the bot.                                                          | - Will take the role **OR** user that will be added. Cannot take both parameters at once.<br>- This can only be used by the server owner  |
| /disallow-enable    | Remove a specific user or role from of enabling/disabling the bot.                                                 | - Will take the role **OR** user that will be removed. Cannot take both parameters at once.<br>- This can only be used by the server owner |
| /view-enabled       | Tells if the bot is enabled/disabled                                                                               |                                                                                                                                         |

## Known Issues
- The instgram fixer (ddinstagram) does not work anymore, and I'm unware of another functional one. If you know of one, please send a pr/issue.
