module.exports = (client, message, params, kraken, fs, twDir, settings) => {
  var stream = params[2];
  if((client.twitchChans.indexOf(stream) < 0) || !fs.existsSync(`${twDir}/${stream}.json`)) return message.channel.send("That channel is not in my database. 🤔");
  var streamFile = JSON.parse(fs.readFileSync(`${twDir}/${stream}.json`, "utf8"));
  if (streamFile.guilds.indexOf(message.guild.id) < 0) return message.channel.send("That channel is not in your guild's database. 🤔");
  else {
    streamFile.guilds.splice(streamFile.guilds.indexOf(message.guild.id), 1);
    fs.writeFileSync(`${twDir}/${stream}.json`, JSON.stringify(streamFile, null, 2), "utf8", function (err) {
      if (err) {
        message.react("❌");
        message.channel.send("There was an error removing this channel from the databse. The owner has been notified of this error.");
        client.users.get(settings.masterId).send(`There was an error adjusting a twitch file from guild ${message.guild.name} Please check the console.`);
        client.log(err);
      } else {
        message.react("✅");
        message.channel.send(`Channel ${stream} removed.`);
      }
    });
  }
};
