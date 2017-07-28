const fs = require ('fs'),
  settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
exports.run = (client, message, params) => {
  switch(params[0]) {
  case "cleverbot":
  case "clbot":
    if(settings.cleverbotEnabled) {
      settings.cleverbotEnabled = false;
      message.channel.sendMessage("Disabled cleverbot.");
    } else {
      settings.cleverbotEnabled = true;
      message.channel.sendMessage("Enabled cleverbot.");
    }
    fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), (err) => {
      if (err) console.error(err);
    });
    break;
  default:
    message.channel.sendMessage("Either you didn\'t specify a parameter or I don\'t recongize that command.");
    break;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 5
};

exports.help = {
  name: "toggle",
  description: "Turns a specified command on/off. Authorization required.",
  usage: "toggle [command]"
};
