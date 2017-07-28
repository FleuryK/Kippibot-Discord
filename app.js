const Discord = require("discord.js");
const fs = require ('fs');
const { promisify } = require('util');
const readdir = promisify(require("fs").readdir);
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
const token = settings.token;
const PersistentCollection = require("djs-collection-persistent");

const client = new Discord.Client();
var Cleverbot = require('cleverbot.io'),
  clbotUser = settings.cleverbotApiUser,
  clbotApiKey = settings.cleverbotApiKey,
  clbot = new Cleverbot(clbotUser, clbotApiKey);
require("./modules/functions.js")(client, clbot);
//require('./util/eventListener')(client);

clbot.create(function (err, session) {
  if (err) console.error(err);
  else {
    client.log("Cleverbot Session created/updated. " + session);
    client.clbotSession = session;
  }
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.guildSettings = new PersistentCollection({name: "guildSettings"});
client.twitchChans = [];
client.onlineChans = [];

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  client.log("INFO", `Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    if (props.conf.enabled) {
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    }
  });
});
fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  client.log("INFO", `Loading a total of ${files.length} events.`);
  files.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});
fs.readdir('./modules/twitch/', (err, files) => {
  if (err) console.error(err);
  client.log("INFO", `Loading a total of ${files.length} twitch channels..`);
  files.forEach(file => {
    client.twitchChans.push(file.split(".")[0]);
  });
});

client.login(token);
