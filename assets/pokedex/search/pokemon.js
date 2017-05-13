const fs = require('fs');
const Discord = require('discord.js');
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
module.exports = (message, args, dexDir) => {
  dexDir = dexDir + `pokemon/${args}.json`;
  if (!fs.existsSync(dexDir)) return message.reply("That Pokémon does not exist. Please check your spelling and try again.");
  let pokeInfo = JSON.parse(fs.readFileSync(dexDir, 'utf8'));
  var colorCode = 0x000000;
  var name,
    dexNo,
    types = "",
    abilities = "",
    dexEntry, category;
  Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  };
  var baseStats =
  `HP: ${pokeInfo.base_stats.hp}\nAtk: ${pokeInfo.base_stats.atk}\nDef: ${pokeInfo.base_stats.def}\nSp. Atk: ${pokeInfo.base_stats.sp_atk}\nSp. Def: ${pokeInfo.base_stats.sp_def}\nSpeed: ${pokeInfo.base_stats.speed}`;
  name = pokeInfo.names.en;
  dexNo = pokeInfo.national_id;
  dexNo = (dexNo).pad(3);
  for (var i = 0; i < pokeInfo.types.length; i++) {
    types = types + pokeInfo.types[i] + "\n";
  }
  for (var j = 0; j < pokeInfo.abilities.length; j++) {
    if (!pokeInfo.abilities[j].hidden) abilities = abilities + `Ability ${j}: ` + pokeInfo.abilities[j].name + "\n";
    else abilities = abilities + `Ability ${j}: ` + pokeInfo.abilities[j].name + " (Hidden)\n";
  }
  category = pokeInfo.categories.en;
  if (!pokeInfo.pokedex_entries.X) dexEntry = pokeInfo.pokedex_entries.Moon.en;
  else dexEntry = pokeInfo.pokedex_entries.X.en;
  colorCode = typeColor[pokeInfo.types[0].toLowerCase()];

  const embed = new Discord.RichEmbed()
  .setTitle(`${name} (#${dexNo})`)
  .setURL("http://bulbapedia.bulbagarden.net/wiki/" + encodeURIComponent(name))
  .setThumbnail(`http://www.serebii.net/sunmoon/pokemon/${dexNo}.png`)
  .setFooter(dexEntry)
  .setColor(colorCode)
  .setDescription(category)
  .addField("**Base Stats**: ", baseStats, true)
  .addField("**Type** ", types, true)
  .addField("**Abilites**: ", abilities);

  message.channel.send({embed}).catch(console.error);
};
