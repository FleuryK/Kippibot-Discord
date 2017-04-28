const request = require("request");
exports.run = (client, message, params) => {
  if (!params[0]) {
    return message.channel.sendMessage("The Magic Kippibot 8-ball cannot predict a blank fortune.");
  }
  request("https://api.rtainc.co/twitch/8ball?format=The+Magic+Kippibot+8-Ball+predicts...+%5B0%5D", function (err, res, body) {
    if (err || res.statusCode !== 200) {
      console.log("Error");
    }
    else { message.channel.sendMessage(body); }
  });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: "8ball",
  description: "Need your fortune told? Have a yes/no question? Find out the 100% true results!",
  usage: "8ball"
};
