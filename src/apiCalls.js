require("dotenv").config();
const version = 10;
const baseUrl = `https://discord.com/api/v${version}`;

// helper method for discord get requests
const getAPICall = async (url, body = {
    method:  'GET',
    headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}`, },
}) => {
    return await fetch(url, body).then(response => {
        if (response.status != 200) {
            console.log(`There was an error: ${response.status} ${response.statusText}`);
            return undefined;
        }
        return response.json();

    });
};

//get a user object given the serverId, and userId
const getServerUser = async (serverId, userId) => {
    return await getAPICall(`${baseUrl}/guilds/${serverId}/members/${userId}`);
};

//get a user object given the serverId, and userIds
const getServerUsers = async (serverId, userIds) => {
    const users = [];
    for(const userId of userIds) {
        users.push(await getServerUser(serverId, userId));
    }
    return users;
}

//get role object given the serverId and roleId
const getServerRoleId = async (serverId, roleId) => {
    return await getAPICall(`${baseUrl}/guilds/${serverId}/roles/${roleId}`);
}

const getServerRolesWithIds = async (serverId, roleIds) => {
    const roles = [];
    for(const roleId of roleIds) {
        roles.push(await getServerRoleId(serverId, roleId));
    }
    return roles;
}

const getServer = async (serverId) => {
    return await getAPICall(`${baseUrl}/guilds/${serverId}`)
}

module.exports = { getServerUser, getServerRoleId, getServerUsers, getServerRolesWithIds, getServer }