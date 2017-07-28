const fs = require ('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
const moment = require('moment');
module.exports = (client, clbot) => {
  client.log = (type, message) => {
    console.log(`[${type}] [${moment().format('DD-MM-YYYY HH:mm:ss')}] ${message}`);
  };

  client.elevation = message => {
    let permlvl = 0;
    if (!message.guild || !message.member) return 0;
    let guildConf = client.guildSettings.get(message.guild.id);
    try {
      //check to see if the user has the mod/admin role, if they exist.
      let mod_role = message.guild.roles.get(guildConf.modRoleID);
      if (mod_role && message.member.roles.has(mod_role)) permlvl = 2;
    } catch (e) {
      //Mod/admin roles not set.
      message.channel.send("Warning: Mod/Admin Roles have not been set. Please fix that using the set command.");
      permlvl = 0;
    }
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    //guild owner
    if (message.author.id === message.guild.ownerID) permlvl = 4;

    //bot owner: id is config.json
    if (message.author.id === settings.masterId) permlvl = 5;

    return permlvl;
  };

  client.reload = command => {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(`../commands/${command}`)];
        let cmd = require(`../commands/${command}`);
        client.commands.delete(command);
        client.aliases.forEach((cmd, alias) => {
          if (cmd === command) client.aliases.delete(alias);
        });
        client.commands.set(command, cmd);
        cmd.conf.aliases.forEach(alias => {
          client.aliases.set(alias, cmd.help.name);
        });
        resolve();
      } catch (e){
        reject(e);
      }
    });
  };

  client.cleverbot = message => {
    clbot.setNick(client.clbotSession);
    //return console.log(sessionName);
    var question = message.content.substring(22);
    console.log(question);
    clbot.ask(question, function (err, response) {
      //console.log(response);
      if (err) return console.error(err);
      message.channel.startTyping();
      setTimeout(() =>{
        message.channel.send(response).catch(console.error);
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
    });
  };

  process.on("uncaughtException", (err) => {
    let errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error("Uncaught Exception: ", errorMsg);
    client.users.get(settings.masterId).send("```ERROR``` \nUncaught Exception.\n" + errorMsg);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Uncaught Promise Error: \n" + err.stack);
    client.users.get(settings.masterId).send("```ERROR``` \nUncaught Promise Error.\n" + err.stack);
  });

};
