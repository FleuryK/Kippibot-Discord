exports.run = (client, message, args) => {
  var action = args[0];
  var userID = args[1];
  var roleID = args[2];
  if (!args[1] || !args[2]) return message.reply("Insufficient parameters. 1");
  let guild = message.guild;
  if (!guild.roles.get(roleID)) return message.reply("Couldn't find a role with that ID.");
  if (!guild.members.get(userID)) return message.reply("Couldn't find a user with that ID.");

  switch(action) {
  case "add":
    guild.members.get(userID).addRole(roleID);
    message.reply(`Role ${guild.roles.get(roleID).name} added to ${guild.members.get(userID).user.tag}`);
    break;
  case "remove":
    guild.members.get(userID).removeRole(roleID);
    message.reply(`Role ${guild.roles.get(roleID).name} removed from ${guild.members.get(userID).user.tag}`);
    break;
  default:
    message.reply("Insufficient parameters.");
    break;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "role",
  description: "Gives/takes the specificed role to/from the specified user",
  usage: "role [add|remove] [user id] [role id]"
};
