module.exports = (client, message, params, kraken, fs, twDir, settings) => {
  var stream = params[2];
  var fileErr = false;
  // If the channel is not in Kippibot's database already, search for it via a call to the Twitch API.
  if (client.twitchChans.indexOf(stream) < 0) {
    kraken({
      url: 'users?login=' + stream
    }, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        client.log('Error');
        message.channel.send("There was an error recieving info from the Twitch API. Try again later.");
        return;
      }
      if (body._total === 0) {
        return message.channel.send("That channel does not exist 🤔");
      }
      var twObj = {
        display_name : body.users[0].display_name,
        id : body.users[0]._id,
        status: "offline",
        discord: null
      };
      fs.writeFileSync(`${twDir}/${stream}.json`, JSON.stringify(twObj, null, 2), (err) => {
        if (err) {
          fileErr = true;
          message.react("❌");
          message.channel.send("There was an error adding this channel to the database. The owner has been notified of this error.");
          client.users.get(settings.masterId).send(`There was an error creating a new twitch file from guild ${message.guild.name} Please check the console.`);
          client.log(err);
        } else {
          client.twitchChans.push(stream);
        }
      });
    });

  }
  // Otherwise, we simply add the guild to the channel file.
  if (fileErr) return;
  let guildTwitch = JSON.parse(fs.readFileSync(`./servers/${message.guild.id}/streamers.json`, "utf8"));
  if (guildTwitch.streamers.indexOf(stream) >= 0) {
    message.react("❌");
    message.channel.send("That channel is already in the database.");
  }
  else {
    var chanObj = {
      name: stream,
      status: "offline",
      discordChan: null,
      msgId: null
    };
    guildTwitch.streamers.push(chanObj);
    fs.writeFileSync(`./servers/${message.guild.id}/streamers.json`, JSON.stringify(guildTwitch, null, 2), (err) => {
      //console.log(err);
      if (err) {
        message.react("❌");
        message.channel.send("There was an error adding this channel to the database. The owner has been notified of this error.");
        client.users.get(settings.masterId).send(`There was an error editing an existing twitch file from guild ${message.guild.name} Please check the console.`);
        client.log(err);
      }
    });
    message.react("✅");
    message.channel.send(`Channel ${stream} added.`);
  }
};
