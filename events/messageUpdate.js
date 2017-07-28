const Discord = require('discord.js');
let modlogId = '326287395064643584';

module.exports = (client, oldMsg, newMsg) => {
  return;
  if (oldMsg.author.id === client.user.id) return;
  let oldContent = (oldMsg.content) ? oldMsg.content : "No Message (or was an attachment)";
  //return console.log(client.channels.get(modlogId).name);

  const embed = new Discord.RichEmbed()
  .setColor(0xFFFF00)
  .addField("Action", "Edit Msg")
  .addField("User", oldMsg.author.tag)
  .addField("Original Message", oldContent)
  .addField("New Message", newMsg.content)
  .addField("Channel", oldMsg.channel.name)
  .setTimestamp();

  client.channels.get(modlogId).send({embed});

};
