module.exports = (message, args, dexDir, typeColor, fs, Discord) => {
  console.log(args);
  dexDir = dexDir + `move/${args}.json`;
  if (!fs.existsSync(dexDir)) return message.reply("That move does not exist. Please check your spelling and try again.");
  let moveInfo = JSON.parse(fs.readFileSync(dexDir, 'utf8'));
  var colorCode = typeColor[moveInfo.type.toLowerCase()];
  var properties = [], propString = "";
  var contact = (moveInfo.makes_contact) ? "Makes contact" : "Does not make contact";
  var protect = (moveInfo.affected_by_protect) ? "Affected by Protect" : "Bypasses Protect";
  var reflect = (moveInfo.affected_by_magic_coat) ? "Reflected by Magic Coat/Magic Bounce" : "Unaffected by Magic Coat/Magic Bounce";
  var snatch = (moveInfo.affected_by_snatch) ? "Affected by Snatch" : "Unaffected by Snatch";
  var mirror = (moveInfo.affected_by_mirror_move) ? "Copyable by Mirror Move" : "Unaffected by Mirror Move";
  var kingsRock = (moveInfo.affected_by_kings_rock) ? "Affected by King's Rock" : "Unaffected by King's Rock";
  properties.push(contact, protect, reflect, snatch, mirror, kingsRock);

  for (var i = 0; i < properties.length; i++) {
    if (i === properties.length - 1)  propString = propString + properties[i];
    else propString = propString + properties[i] + ", ";
  }
  var critRate = {
    0: "6.25%",
    1: "12.5%",
    2: "50%",
    3: "100%"
  };
  var accuracy = (moveInfo.accuracy === 0) ? "Always Hit" : moveInfo.accuracy;
  var critString = critRate[moveInfo.critical_hit];

  const embed = new Discord.RichEmbed()
  .setTitle(moveInfo.names.en)
  .setColor(colorCode)
  .setURL("http://bulbapedia.bulbagarden.net/wiki/" + encodeURIComponent(moveInfo.names.en))
  .setDescription(`Type: ${moveInfo.type} | Category: ${moveInfo.category}`)
  .addField("Power:", moveInfo.power, true)
  .addField("PP (Maxed):", `${moveInfo.pp} (${moveInfo.max_pp})`, true)
  .addField("Acc:", accuracy, true)
  .addField("Secondary effect: ", "To be filled!")
  .setFooter(moveInfo.descriptions.en)
  .addField("Base Crit Rate:", critString, true)
  .addField("Priority:", moveInfo.priority, true)
  .addField("Target:", moveInfo.target, true)
  .addField("Properties:", propString);
  message.channel.send({embed});
};
