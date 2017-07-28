const Discord = require('discord.js');

module.exports = (client, message) => {
  //return;
  let content = (message.content) ? message.content : "No Message (or was an attachment)";
  //return console.log(client.channels.get(modlogId).name);

  const embed = new Discord.RichEmbed()
  .setColor(0xFFFF00)
  .addField("Action", "Delete Msg")
  .addField("User", `${message.author.tag} (${message.author.id})`)
  .addField("Message", content)
  .addField("Channel", message.channel.name)
  .setTimestamp();

  client.channels.get(client.guildSettings.get(message.guild.id).modLogChannel).send({embed});

};
