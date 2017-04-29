const settings = require(`../settings.json`),
  request = require('request'),
  Discord = require('discord.js'),
  fs = require ('fs'),
  moment = require('moment');

var myTimer;

let twitchStreams = JSON.parse(fs.readFileSync('./streamers.json', 'utf8')),
  kraken = request.defaults({
    baseUrl: 'https://api.twitch.tv/kraken/',
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': settings.twitchClientId,
      'Authorization': settings.twitchAuthToken
    },
    json: true
  });

exports.run = (client, message, params) => {
  if(!params[0]) {
    return message.channel.sendMessage("You must specify a command!").catch(console.error);
  }
  for(var x = 0; x < params.length; x++) {
    params[x] = params[x].toLowerCase();
  }
  if (params[0] === 'channel') {

    if (!params[1]) {
      return message.channel.sendMessage("You must specify an operand!").catch(console.error);
    }

    if (!params[2]) {
      return message.channel.sendMessage("You must specify a channel!").catch(console.error);
    }

		/*if (params[1] === 'announce') {
			let channelId = message.mentions.channels.firstKey();
			/*settings.
			fs.writeFile('./settings.json', JSON.stringify(settingsConf, null, 2), (err) => {

			}

			message.channel.sendMessage("I will now announce streams in channel: " + params[2]);
			//return client.channels.get(channelId).sendMessage("it worked master!");
			//return console.log(message.mentions.channels.firstKey());
		}*/

    let stream = params[2];
    if (params[1] === 'add') {
      for (var i = 0; i < twitchStreams.streamers.length; i++) {
        if (stream === twitchStreams.streamers[i].name) {
          return message.channel.sendMessage("Channel " + stream + " is already in the caster database." );
        }
      }
      let userId;
      let logo;
      kraken({
        url: 'users?login=' + stream
      }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
          console.log('Error');
          message.channel.sendMessage("There was an error recieving info from the Twitch API. Try again later.");
          return;
        }
        if (body._total === 0) {
          return message.channel.sendMessage("That channel does not exist, you dunce.");
        }
        userId = body.users[0]._id;
        logo = body.users[0].logo;
        twitchStreams.streamers[twitchStreams.streamers.length] = {
          name: stream,
          id: userId,
          status: "offline",
          logo: logo
        };
        fs.writeFile('./streamers.json', JSON.stringify(twitchStreams, null, 2), (err) => {
          if (err) console.error(err);
          else {
            message.channel.sendMessage("Channel " + stream + " added to database.");
          }
        });

      });
    }
    if (params[1] === 'remove') {
      for (var j = 0; j < twitchStreams.streamers.length; j++) {
        if (stream === twitchStreams.streamers[j].name) {
          twitchStreams.streamers.splice(j, 1);
          fs.writeFile('./streamers.json', JSON.stringify(twitchStreams, null, 2), (err) => {
            if (err) console.error(err);
            else {
              return message.channel.sendMessage("Channel " + stream + " has been removed from the caster database." );
            }
          });
        }
      }
      if (j > twitchStreams.streamers.length + 1) return message.channel.sendMessage("Channel " + stream + " is not in the caster database." );
    }
  }
  else if (params[0] === 'startupdate') {
    myTimer = setInterval(updateStreams, 60000, client, message);
    message.delete();
    console.log("Now polling Twitch every minute.");
  }
  else if (params[0] === 'stopupdate') {
    clearInterval(myTimer);
    message.delete();
    console.log("No longer polling Twitch.");
  }
};

function alreadyOnline(channel) {
  for (var i = 0; i < twitchStreams.streamers.length; i++) {
    if (channel === twitchStreams.streamers[i].name) {
      if (twitchStreams.streamers[i].status === "online") {
        return true;
      }

      return false;
    }
  }
}

function updateStreams(client) {
  var channelId = settings.defaultChannelAnnouncements;
  var streams = "";
  var onlineStreams = [];
  for (var j = 0; j < twitchStreams.streamers.length; j++) {
    if (j === twitchStreams.streamers.length - 1) {
      streams = streams + twitchStreams.streamers[j].id;
    } else {
      streams = streams + twitchStreams.streamers[j].id + ",";
    }
  }
  //Get stream info of multiple channels.
  kraken({
    url: 'streams/?channel=' + streams
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      return console.log('Error recieving info from the Twitch API.');
    }
    if (body._total > 0) {
      for (var i = 0; i < body.streams.length; i++) {
        let chan = body.streams[i];
        onlineStreams[i] = chan.channel.name;
        if (!alreadyOnline(chan.channel.name)) {
          if (chan.channel.logo !== null) {
            const embed = new Discord.RichEmbed()
            .setTitle(chan.channel.display_name + " went online!")
            .setColor(0x00FF00)
            .setFooter('Kippibot' + ' | Stream went live at: ' + `${moment(chan.created_at).format('MM-DD-YYYY HH:mm:ss')} `)
            .setThumbnail(chan.channel.logo)
            //.setTimestamp()
            .setURL('https://www.twitch.tv/' + chan.channel.display_name)
            .addField('Status', chan.channel.status, true)
            .addField('Viewers', chan.viewers, true)
            .addField('Game', chan.game, true)
            .addField('Followers', chan.channel.followers, true);
            client.channels.get(channelId).sendEmbed(embed).catch(console.error);
          }
          else {
            const embed = new Discord.RichEmbed()
            .setTitle(chan.channel.display_name + " went online!")
            .setColor(0x00FF00)
            .setFooter('Kippibot' + 'Stream went live at: ' + chan.created_at)
            .setURL('https://www.twitch.tv/' + chan.channel.display_name)
            .addField('Status', chan.channel.status, true)
            .addField('Viewers', chan.viewers, true)
            .addField('Game', chan.game, true)
            .addField('Followers', chan.channel.followers, true);
            client.channels.get(channelId).sendEmbed(embed).catch(console.error);
          }
        }
      }
    }
    //Search for the channel, and change its status if applicable.
    for (var n = 0; n < twitchStreams.streamers.length; n++) {
      if (onlineStreams.indexOf(twitchStreams.streamers[n].name) < 0) {
        if (twitchStreams.streamers[n].status !== "offline") {
          getChannelInfo(twitchStreams.streamers[n].id, twitchStreams.streamers[n].logo, client, channelId);
        }
        twitchStreams.streamers[n].status = "offline";
      } else {
        twitchStreams.streamers[n].status = "online";
      }
    }


    fs.writeFile('./streamers.json', JSON.stringify(twitchStreams, null, 2), (err) => {
      if (err) console.error(err);
    });
  }

);
}
function getChannelInfo(channelId, logo, client, msgChanId) {
  kraken({
    url: 'channels/' + channelId
  }, (err, res, body) => {
    if (err || res.statusCode !== 200) {
      console.log('Error');
      console.log("There was an error recieving info from the Twitch API. Try again later.");
      return;
    }
    if (logo === null) {
      const embed = new Discord.RichEmbed()
      .setTitle(body.display_name + " went offline!")
      .setColor(0xFF0000)
      .setFooter('Kippibot')
      .setURL('https://www.twitch.tv/' + body.display_name)
      .addField('Status', 'Offline', true)
      .addField('Viewers', 'N/A', true)
      .addField('Game', 'N/A', true)
      .addField('Followers', body.followers, true);
      client.channels.get(msgChanId).sendEmbed(embed).catch(console.error);
    }
    else {
      const embed = new Discord.RichEmbed()
      .setTitle(body.display_name + " went offline!")
      .setColor(0xFF0000)
      .setFooter('Kippibot')
      .setThumbnail(logo)
      .setTimestamp()
      .setURL('https://www.twitch.tv/' + body.display_name)
      .addField('Status', 'Offline', true)
      .addField('Viewers', 'N/A', true)
      .addField('Game', 'N/A', true)
      .addField('Followers', body.followers, true);
      client.channels.get(msgChanId).sendEmbed(embed).catch(console.error);
    }
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['stream', 'tw'],
  permLevel: 4
};

exports.help = {
  name: 'twitch',
  description: 'Commands for managing caster database.',
  usage: 'twitch channel add|remove  [channel name]. Use twitch startUpdate to start tracking status update for all channels in the database.'
};
