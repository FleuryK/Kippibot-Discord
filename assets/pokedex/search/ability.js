const fs = require('fs');
const Discord = require('discord.js');
module.exports = (message, args, dexDir) => {
  dexDir = dexDir + `ability/${args}.json`;
  if (!fs.existsSync(dexDir)) return message.reply("That ability does not exist. Please check your spelling and try again.");
  let abilityInfo = JSON.parse(fs.readFileSync(dexDir, 'utf8'));
  const embed = new Discord.RichEmbed()
  .setTitle(abilityInfo.names.en)
  .setColor(0x0000FF)
  .setURL("http://bulbapedia.bulbagarden.net/wiki/" + encodeURIComponent(abilityInfo.names.en))
  .setDescription(abilityInfo.descriptions.en);

  message.channel.send({embed});
};
