exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  let target = message.mentions.users.first();
  let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'silenced');
  if (!muteRole) return message.reply('There\'s no mute role.').catch(console.error);
  if (reason.length < 1) return message.reply('You must supply a reason for the mute.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);

  if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (message.guild.member(target).roles.has(muteRole.id)) {
    message.guild.member(target).removeRole(muteRole).then(() => {
      target.sendMessage("you have been unmuted. " + "Reason: " + reason);
    });
  } else {
    message.guild.member(target).addRole(muteRole).then(() => {
      target.sendMessage("you have been muted. " + "Reason: " + reason);
    });
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['m'],
  permLevel: 2
};

exports.help = {
  name: 'mute',
  description: 'Use only for naughty people. Makes it so they cannot send messages.',
  usage: 'mute [mention] [reason (optional)]'
};
