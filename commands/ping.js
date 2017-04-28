exports.run = (client, message) => {
  message.channel.sendMessage("", {embed: {
    title: `Message response test`,
    color: 3447003,
    description: `Pong! \`${Date.now() - message.createdTimestamp} ms \``
  }});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Used for testing response time. Or if you want to play a game of Ping-Pong I guess.',
  usage: 'ping'
};
