exports.run = (client, message) => {
  var uptime = client.uptime;
  var sec_num = Math.floor(uptime / 1000); // 491
  var days = Math.floor(sec_num / 86400); // 0
  var hours = Math.floor((sec_num - (days * 86400)) / 3600); // 491 - 0 / 3600 = 0
  var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60); // 491 - 0 / 60 = 8
  var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60); // 491 - 480 = 11
  message.channel.sendMessage(`Uptime: ${days} d ${hours} h ${minutes} m ${seconds} s`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "uptime",
  description: "If you\'re THAT curious on how long I\'ve been up, I suppose you can use this.",
  usage: "uptime"
};
