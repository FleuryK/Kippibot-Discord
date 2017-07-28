module.exports = (client, member) => {
  let guild = member.guild;
  guild.defaultChannel.send(`Goodbye ${member.user.username} we will miss you... :cry: `);
};
