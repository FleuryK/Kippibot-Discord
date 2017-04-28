module.exports = member => {
  let guild = member.guild;
  guild.defaultChannel.sendMessage(`Welcome ${member.user.username} to ` + guild.name + ". Enjoy your time here!");
};
