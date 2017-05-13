const fs = require('fs');
const Discord = require('discord.js');
const settings = require('../settings.json')
const dexSearch = (field) => require(`../assets/pokedex/search/${field}`);
let typeColor = {
  "normal": 0xA8A77A, //grey
  "fire": 0xEE8130, //orange
  "water": 0x6390F0, //blue
  "electric": 0xF7D02C, //yellow
  "grass": 0x7AC74C, //green
  "ice": 0x96D9D6, //light blue
  "fighting": 0xC22E28, //red
  "poison": 0xA33EA1, //purple
  "ground": 0xEABF65, //light brown
  "flying": 0xA98FF3, //sky blue
  "psychic": 0xF95587, //magenta-ish
  "bug": 0xA6B91A, //yellow-green
  "rock": 0xB6A136, //brown
  "ghost": 0x735797, //indigo
  "dragon": 0x6F35FC, //navy blue
  "dark": 0x705746, //black
  "steel": 0xB7B7CE, //silver
  "fairy": 0xD685AD //pink
};
var dexDir;
exports.run = (client, message, params) => {
  dexDir = "./assets/pokedex/";
  if (!params[0]) return message.channel.send("Error: Search parameter is blank. ").catch(console.error);
  var search = params[0].toLowerCase();
  var args = params.slice(1).join(" ").toLowerCase().replace(/ /g, "_");
  switch (search) {
  case "pokemon":
    dexSearch('pokemon')(message, args, dexDir, typeColor, fs, Discord);
    break;
  case "ability":
    dexSearch('ability')(message, args, dexDir, fs, Discord);
    break;
  case "move":
    dexSearch('move')(message, args, dexDir, typeColor, fs, Discord);
    break;
  case "editmove":
  case "edit":
    if (message.author.id !== settings.masterId) message.reply("Can't let you do that.");
    else dexSearch('editMove')(message, params, dexDir, fs);
    break;
  case "type":
    dexSearch('type')(message, params, dexDir, typeColor, fs, Discord);
    break;
  default:
    message.channel.send("Invalid search parameters.").catch(console.error);
    break;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dex', 'pokemon', 'ability', 'move'],
  permLevel: 0
};
exports.help = {
  name: "pokedex",
  description: "Use to search for info on Pokémon, abilities, and more!",
  usage: "[pokedex|dex] [pokemon|ability|move|type] [name]"
};
