const settings = require(`../settings.json`);
module.exports = (client, guild) => {
  //console.log(`Joined ${guild.name}`);
  guild.defaultChannel.send(`Greetings! Kippibot is now invading- er, residing in your server! Glad to be in here! To see my commands, type +help. If you have any questions please send a DM to ${guild.client.users.get(settings.masterId).tag}, not me! `);
  const defaultSettings = {
    prefix: "+",
    defaultTwitchAnnouncements: guild.defaultChannel.id,
    modLogChannel: null,
    twitchChannels: [],
    streamerRoleID: null,
    vodcastRoleID: null,
    regRoleID: null,
    modRoleID: null,
    muteRoleID: null,
    welcomeChannel: guild.defaultChannel.id,
    welcomeMessage: "Welcome %user% to %guild%! Enjoy your time here!"
  };
  client.guildSettings.set(guild.id, defaultSettings);
  client.log("INFO", `Successfully created file for ${guild.name}`);
};
