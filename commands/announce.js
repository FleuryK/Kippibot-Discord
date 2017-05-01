exports.run = (client, message, args) => {
  let announceMsg = args.slice(1).join(" ");
  let announceChannel = message.mentions.channels.first();
  if (announceMsg.length < 1) return message.reply("What am I announcing?");
  if (message.mentions.channels.size < 1) return message.reply("I can\'t announce without having a channel to say the announcement.");

  announceChannel.send("@here " + announceMsg);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['say'],
  permLevel: 3
};

exports.help = {
  name: 'announce',
  description: 'Use to send an announcement to a given channel',
  usage: 'announce [channel mention] [message]'
};
