exports.run = (client, message) => {
  client.generateInvite(1341643969)
    .then(link => {
      message.channel.send(`Here's the link to invite me! ${link}`);
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['inv'],
  permLevel: 4
};

exports.help = {
  name: 'invite',
  description: 'Used for getting my invite link. Handle with care. ;)',
  usage: 'invite'
};
