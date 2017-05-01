exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let target = message.mentions.users.first();
  let guild = message.guild;
  if (reason.length < 1) return message.reply('You must supply a reason for the kick.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to kick them.').catch(console.error);

  if (!guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (!guild.member(target).kickable) return message.reply('I can\'t kick this member you dunce.');
  target.send("You have been kicked from  " + guild.name + " Reason: " + reason);
  guild.member(target).kick();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['k'],
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'Use only for naughty people. Gives them a nice little kick from the server',
  usage: 'kick [mention] [reason]'
};
