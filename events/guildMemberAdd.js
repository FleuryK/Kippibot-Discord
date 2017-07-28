module.exports = (client, member) => {
  let guild = member.guild;
  const guildConf = client.guildSettings.get(guild.id);
  const welcomeMessage = guildConf.welcomeMessage.replace("%user%"/g, member.user.username).replace("%guild"/g, guild.name);
  guild.defaultChannel.send(welcomeMessage);
};
