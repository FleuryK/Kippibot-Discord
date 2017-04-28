module.exports = member => {
  let guild = member.guild;
  guild.defaultChannel.sendMessage(`Welcome ${member.user.username} to the server! Enjoy your time here! :)`);
};
