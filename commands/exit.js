exports.run = (client, message) => {
  message.channel.send("Goodbye. :wave:");
  client.destroy();
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["quit"],
  permLevel: 5
};
exports.help = {
  name: "exit",
  description: "Terminate the program. Authorized access required.",
  usage: "exit"
};
