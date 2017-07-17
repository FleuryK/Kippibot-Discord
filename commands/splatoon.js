const request = require('request'),
moment = require('moment'),
fs = require('fs');

exports.run = (client, message, args) => {
  if(!args[0] || args[0] !== "schedule" && args[0] !== "rotation") return message.reply("Insufficient parameters.");
  request("https://splatoon.ink/schedule.json", (err, res, body) => {
    const obj = JSON.parse(body);
    let timeFirst = moment(obj.schedule[1].startTime).diff(moment()),
    timeSecond = moment(obj.schedule[1].endTime).diff(moment());

    function formatTimes(time) {
      let sec_num = Math.floor(time / 1000),
      hours = Math.floor(sec_num / 3600),
      minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      return (`${hours} hours, ${minutes} minutes`);
    }

    //return console.log(formatTimes(timeFirst));
    // mode[0] = Turf
    // mode[1] = Ranked (SZ, TC, RM)
    if (err) return message.channel.send("There was an error getting the Splatoon map data. Try again later.");
    if (args[0] === "rotation") {
      return message.channel.send(`Current Rotation:\n
Turf Wars: ${obj.schedule[0].modes[0].maps[0].nameEN} & ${obj.schedule[0].modes[0].maps[1].nameEN}
${obj.schedule[0].modes[1].rules.en}: ${obj.schedule[0].modes[1].maps[0].nameEN} & ${obj.schedule[0].modes[1].maps[1].nameEN}`, {code: 'css'});
    }
    if (args[0] === "schedule") {
      return message.channel.send(`Current Rotation:\n
Turf Wars: ${obj.schedule[0].modes[0].maps[0].nameEN} & ${obj.schedule[0].modes[0].maps[1].nameEN}
${obj.schedule[0].modes[1].rules.en}: ${obj.schedule[0].modes[1].maps[0].nameEN} & ${obj.schedule[0].modes[1].maps[1].nameEN}

In ${formatTimes(timeFirst)}:\n
Turf Wars: ${obj.schedule[1].modes[0].maps[0].nameEN} & ${obj.schedule[1].modes[0].maps[1].nameEN}
${obj.schedule[1].modes[1].rules.en}: ${obj.schedule[1].modes[1].maps[0].nameEN} & ${obj.schedule[1].modes[1].maps[1].nameEN}

In ${formatTimes(timeSecond)}:\n
Turf Wars: ${obj.schedule[2].modes[0].maps[0].nameEN} & ${obj.schedule[2].modes[0].maps[1].nameEN}
${obj.schedule[2].modes[1].rules.en}: ${obj.schedule[2].modes[1].maps[0].nameEN} & ${obj.schedule[2].modes[1].maps[1].nameEN}`);
    }
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['splat'],
  permLevel: 4
};

exports.help = {
  name: 'splatoon',
  description: 'Commands for getting splatoon data. (Soon to support 2)',
  usage: 'splatoon [schedule|rotation]'
};
