module.exports = member => {
    let guild = member.guild;
    guild.defaultChannel.sendMessage(`Goodbye ${member.user.username} we will miss you... :cry: `);
};