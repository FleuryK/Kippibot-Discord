const settings = require(`../settings.json`),
  request = require('request'),
  //Discord = require('discord.js'),
  fs = require ('fs'),
  //moment = require('moment'),
  twDir = './modules/twitch';

var twitchReq = (func) => require(`../modules/twitchFunctions/${func}`);

var kraken = request.defaults({
  baseUrl: 'https://api.twitch.tv/kraken/',
  headers: {
    'Accept': 'application/vnd.twitchtv.v5+json',
    'Client-ID': settings.twitchClientId,
    'Authorization': settings.twitchAuthToken
  },
  json: true
});

exports.run = (client, message, params) => {
  switch(params[0]) {
  case "channel":
    var chanCmd = {
      "add": "addStream",
      "remove": "removeStream",
      "rem": "removeStream"
    };
    if (!params[2]) return message.reply("Insufficient parameters.");
    try {
      twitchReq(chanCmd[params[1]])(client, message, params, kraken, fs, twDir, settings);
    } catch (e) {
      client.log("ERROR", e);
    }
    break;
  case "set":
    var setCmd = {
      "streamRole": "setStreamRole",
      "vodcastRole": "setVodcastRole",
      "announcements": "setDefaultChan",
      "defaultAnnounceChannel": "setDefaultChan",
      "notify": "setNotify"
    };
    if (!params[2]) return message.reply("Insufficient parameters.");
    try {
      twitchReq(setCmd[params[1]])(client, message, params[2], fs, twDir, settings);
    } catch (e) {
      client.log("ERROR", e);
    }

  }

};

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
