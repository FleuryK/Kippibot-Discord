const settings = require(`../settings.json`);
module.exports = (client, guild) => {
  guild.owner.send(`Greetings! Kippibot is now invading- er, residing in your server **${guild.name}**! Glad to be in here! To see my commands, type +help in a text channel (NOT DM). If you have any questions please send a DM to ${guild.client.users.get(settings.masterId).tag}, not me! `);
  const defaultSettings = {
    prefix: "+",
    defaultTwitchAnnouncements: null,
    modLogChannel: null,
    streamerRoleID: null,
    vodcastRoleID: null,
    regRoleID: null,
    managers: [],
    muteRoleID: null,
    membersChannel: null,
    welcomeMessage: "Welcome %user% to %guild%! Enjoy your time here!",
    partMessage: "Goodbye %user% we will miss you..."
  };
  let filterMem = guild.members.filter(m => m.hasPermission("MANAGE_GUILD"));
  filterMem.forEach(m => defaultSettings.managers.push(m.id));
  client.guildSettings.set(guild.id, defaultSettings);
  client.log("INFO", `Joined guild ${guild.name}`);
};
