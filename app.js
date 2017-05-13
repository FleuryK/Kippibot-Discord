const Discord = require("discord.js");
const fs = require ('fs');
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
const token = settings.token;
const moment = require('moment');
const client = new Discord.Client();
var Cleverbot = require('cleverbot.io'),
  clbotUser = settings.cleverbotApiUser,
  clbotApiKey = settings.cleverbotApiKey,
  clbot = new Cleverbot(clbotUser, clbotApiKey),
  sessionName = "";
require('./util/eventListener')(client, clbot);

const log = message => {
  console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${message}`);
};

clbot.create(function (err, session) {
  if (err) console.error(err);
  else {
    log("Cleverbot Session created/updated. " + session);
    sessionName = session;
  }
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files)=> {
  if (err) console.error(err);
  log(`Loading ${files.length} commands...`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}. \\o/`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
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
  clbot.setNick(sessionName);
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


client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  let mod_role = message.guild.roles.find('name', settings.modrolename);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  let admin_role = message.guild.roles.find('name', settings.adminrolename);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
  if (message.author.id === message.guild.ownerID) permlvl = 4;
  if (message.author.id === settings.masterId) permlvl = 5;
  return permlvl;
};

client.on('warn', e => {
  console.log(e);
});

client.on('error', e => {
  console.log(e);
});

client.login(token);

client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
client.on('debug', (e) => console.info(e));

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});
