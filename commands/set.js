const fs = require('fs');
const settings = require(`../settings.json`);
exports.run = (client, message, params) => {
  let guild = message.guild,
    guildConf = client.guildSettings.get(guild.id);
  switch(params[0]) {
  case "regrole":
    if(!params[1]) message.reply("You must specify a role!");
    else {
      let regRole = guild.roles.find('name', params[1]);
      if(!regRole) message.reply("That role does not exist. Please recheck your spelling and/or recheck your role list.");
      else {
        guildConf["regRoleID"] = regRole.id;
        client.guildSettings.set(guild.id, guildConf);
        message.channel.send("Regulars role set.");
      }
    }
    break;
  case 'modrole':
    if(!params[1]) message.reply("You must specify a role!");
    else {
      let modRole = guild.roles.find('name', params[1]);
      if(!modRole) message.reply("That role does not exist. Please recheck your spelling and/or recheck your role list.");
      else {
        guildConf["modRoleID"] = modRole.id;
        client.guildSettings.set(guild.id, guildConf);
        message.channel.send("Mod role set.");
      }
    }
    break;
  case 'adminrole':
    if(!params[1]) message.reply("You must specify a role!");
    else {
      let adminRole = guild.roles.find('name', params[1]);
      if(!adminRole) message.reply("That role does not exist. Please recheck your spelling and/or recheck your role list.");
      else {
        guildConf["adminRoleID"] = adminRole.id;
        client.guildSettings.set(guild.id, guildConf);
        message.channel.send("Admin role set.");
      }
    }
    break;
  case "prefix":

  case 'help':
  case 'commands':
    message.author.send(`= Settings command list: =\n\nUsage: ${settings.prefix}set <command name> <parameters>
      \n\nregrole ${" ".repeat(4)} :: Sets the default regualrs role for level 1 commands. Required parameters: role name (no mention or id)\n` +
      `nmodrole ${" ".repeat(4)} :: Sets the default mod role for level 2 commands. Required Parameters: role name (no mention or id)\n` +
      `adminrole ${" ".repeat(4)} :: Sets the default admin role for level 3 commands. Required Parameters: role name (no mention or id)\n` +
      `modlog ${" ".repeat(4)} :: Sets the default modlog channel. Required parameters: channel (name, mention, or id)`, {code: "asciidoc"});
    message.reply("I have sent you a list of commands in a DM.");
    break;
  default:
    message.reply("That setting does not exist.");
    break;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'set',
  description: 'Commands for managing server settings.',
  usage: '+set help for a list of commands you can use.'
};
