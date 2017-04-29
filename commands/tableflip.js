exports.run = (client, message) => {
  let gifNum = Math.floor(Math.random() * 5);
  message.channel.sendFile(".\\fun\\tableflips\\tableflip-" + gifNum + ".gif");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "tableflip",
  description: "UNLEASH THE RAGE! FLIP THAT TABLE LIKE IT'S NOT TOMORROW! :3 (Note: do not spam)",
  usage: "tableflip"
};
