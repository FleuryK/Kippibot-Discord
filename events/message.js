const fs = require ('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
module.exports = (client, message) => {
  //return console.log(message.author);
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) {
    if(message.mentions.users.size >= 1) {
      if(message.mentions.users.first() === client.user && client.user.id === message.content.split(' ')[0].substring(2, 20) &&
            settings.cleverbotEnabled) {
        client.cleverbot(message);
      }
    }
    return;
  }
  let command = message.content.split(' ')[0].slice(settings.prefix.length);
  command = command.toLowerCase();
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if(command === "clbot") {
    if (perms < 5) return;
    switch (params[0]) {
    case "enable":
    case "on":
      settings.cleverbotEnabled = true;
      message.channel.send("Enabled cleverbot.");
      break;
    case "disable":
    case "off":
      settings.cleverbotEnabled = false;
      message.channel.send("Disabled cleverbot.");
      break;
    default:
      message.channel.send("Please specify an option.");
      break;
    }
    fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), (err) => {
      if (err) console.error(err);
      return;
    });
  }
  else if ((command === "linktwitch") && (message.channel.type === "dm"))  {
    require('./modules/twitchFunctions/linkStream');
    return;
  }
  else if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (cmd.conf.guildOnly && !message.guild) return;
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }

};
