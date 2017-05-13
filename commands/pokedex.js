const fs = require('fs');
const Discord = require('discord.js');
const dexSearch = (field) => require(`../assets/pokedex/search/${field}`);
var dexDir;
exports.run = (client, message, params) => {
  dexDir = "./assets/pokedex/";
  if (!params[0]) return message.channel.send("Error: Search parameter is blank. ").catch(console.error);
  var search = params[0].toLowerCase();
  var args = params.slice(1).join(" ").toLowerCase().replace(/ /g, "_");
  switch (search) {
  case "pokemon":
    dexSearch('pokemon')(message, args, dexDir);
    break;
  case "ability":
    dexSearch('ability')(message, args, dexDir);
    break;
  case "move":
    dexSearch('move')(message, args, dexDir);
    break;
  case "editmove":
  case "edit":
    dexSearch('editMove')(message, params, dexDir);
    break;
  default:
    message.channel.send("Invalid search parameters.").catch(console.error);
    break;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dex'],
  permLevel: 0
};
exports.help = {
  name: "pokedex",
  description: "Gotta catch 'em all!",
  usage: "[pokedex|dex] [pokemon|ability|move] [name]"
};
