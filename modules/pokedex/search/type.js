module.exports = (message, params, dexDir, typeColor, fs, Discord) => {
  var args = params.slice(1).join(" ");
  var types = args.split('/');
  var fileErr = false;
  var typeFile;
  var defResist = [],
    defWeak = [],
    defImmune = [];
  console.log(types);
  for (var i = 0; i < types.length; i++) {
    if(!fs.existsSync(dexDir + `types/${types[i]}.json`)) {
      fileErr = true;
      break;
    }
    else {
      typeFile = JSON.parse(fs.readFileSync(dexDir + `types/${types[i].toLowerCase()}.json`, 'utf8'));
      for (var x in typeFile.attackingTypes) {
        if(typeFile.attackingTypes[x] === 2.0) {
          if (i > 0) {
            if (defImmune.indexOf(x) > - 1) continue;
            else if (defResist.indexOf(x) > -1) defResist.splice(defResist.indexOf(x), 1);
            else defWeak.push(x);
          }
          else defWeak.push(x);
        }
        else if(typeFile.attackingTypes[x] === 0.5) {
          if (i > 0) {
            if (defImmune.indexOf(x) > - 1) continue;
            else if (defWeak.indexOf(x) > -1) defWeak.splice(defWeak.indexOf(x), 1);
            else defResist.push(x);
          }
          else defResist.push(x);
        }
        else if(typeFile.attackingTypes[x] === 0.0) {
          if (i > 0) {
            if (defResist.indexOf(x) > -1) defResist.splice(defResist.indexOf(x), 1);
            if (defWeak.indexOf(x) > -1) defWeak.splice(defWeak.indexOf(x), 1);
            defImmune.push(x);
          }
          else defImmune.push(x);
        }
      }
    }
  }
  if (fileErr) return message.reply("One of the types you entered returned an error. :cry:");
  var resistsMsg = "";
  var weaknessMsg = "";
  var immuneMsg = "";
  for (var j = 0; j < defResist.length; j++) {
    if (j < defResist.lastIndexOf(defResist[j])) resistsMsg += `${defResist[j]} (0.25x), `;
    else if (j > defResist.indexOf(defResist[j])) continue;
    else resistsMsg += `${defResist[j]} (0.5x), `;
  }
  for (j = 0; j < defWeak.length; j++) {
    if (j < defWeak.lastIndexOf(defWeak[j])) weaknessMsg += `${defWeak[j]} (4x), `;
    else if (j > defWeak.indexOf(defWeak[j])) continue;
    else weaknessMsg += `${defWeak[j]} (2x), `;
  }
  for (j = 0; j < defImmune.length; j++) {
    immuneMsg += `${defImmune[j]} (0x), `;
  }
  resistsMsg = (defResist.length > 0) ? resistsMsg.substring(0, resistsMsg.length - 2) : "None";
  weaknessMsg = (defWeak.length > 0) ? weaknessMsg.substring(0, weaknessMsg.length - 2) : "None";
  immuneMsg = (defImmune.length > 0) ? immuneMsg.substring(0, immuneMsg.length - 2) : "None";

  const embed = new Discord.RichEmbed()
  .setTitle(types.join("/"))
  .setColor(typeColor[types[0].toLowerCase()])
  .addField("**Resistances**", resistsMsg)
  .addField("**Weaknesses**", weaknessMsg)
  .addField("**Immunities**", immuneMsg)
  .setTimestamp()

  message.channel.send({embed});

  //message.channel.send(`${resistsMsg}\n${weaknessMsg}\n${immuneMsg}`);
  //message.channel.send(`Strong against: ${defResist.toString()}\nWeak against: ${defWeak.toString()}\nImmune: ${defImmune.toString()}`);
};
