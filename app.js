const Discord = require("discord.js");
const settings = require(`./settings.json`);
const token = settings.token;
const ddiff = require("return-deep-diff");
const fs = require ('fs');
const moment = require('moment');
const client = new Discord.Client();
require('./util/eventListener')(client);

const log = message => {
    console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files)=> {
    if (err) console.error(err);
    log(`Loading ${files.length} commands...`);
    files.forEach(f => {
        let props = require(`./commands/${f}`);
        log(`Loading Command: ${props.help.name}. \\o/`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  let mod_role = message.guild.roles.find('name', settings.modrolename);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  let admin_role = message.guild.roles.find('name', settings.adminrolename);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
  if (message.author.id === settings.ownerid) permlvl = 4;
  return permlvl;
};

client.on('warn', e => {
  console.log(e);
});

client.on('error', e => {
  console.log(e);
});



/*var prefix = "+";
client.on('message', message => {
  //console.log(`[` + message.createdAt + `] ` + message.author.username + `: ` + message.content);
  let args = message.content.split(' ').slice(1);
  var result = args.join(' ');
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;
  
  if (message.content.startsWith(prefix + 'exit')) {
	  message.channel.sendMessage('Goodbye.');
	  client.destroy();
  }
  
  if (message.content.startsWith(prefix + 'ping')) {
    message.channel.sendMessage("", {embed: {
      title: `Message response test`,
      color: 3447003,
      description: `pong! \`${Date.now() - message.createdTimestamp} ms \``
    }});
  } else

  if (message.content.startsWith(prefix + 'twitch')) {
    message.channel.sendMessage("", {embed: {
      title: `Kippi00`,
      color: 10181046,
      description: `https://www.twitch.tv/Kippi00`,
      url: `https://www.twitch.tv/Kippi00`,
    }});
  } else

  if (message.content.startsWith(prefix + 'test')) {
    if (!result) return;
    message.channel.fetchMessage(result)
     .then(message => console.log(message.content))
     .catch(console.error);
  }

  // setting game and status

  if (message.content.startsWith(prefix + 'setgame')) {
    if (!result) {
      result = null;
    }
    client.user.setGame(result);
  } else

  if (message.content.startsWith(prefix + 'setstatus')) {
    if (!result) {
      result = 'online';
    }
    client.user.setStatus(result);
  }

  if (message.content.startsWith(prefix + 'invite')) {
    if (message.author.id !== '97750495975714816') {
      message.channel.sendMessage('No.');
      return;
    } else
    client.generateInvite(1341643969)
      .then(link => {
        message.channel.sendMessage(`Here's the link to invite me! ${link}`);
    });
  }

  //voice channel
  if (message.content.startsWith(prefix + 'join')) {
  		let voiceChan = message.member.voiceChannel;
  		if (!voiceChan || voiceChan.type !== 'voice') {
  			message.channel.sendMessage('No').catch(error => message.channel.sendMessage(error));
  		} else if (message.guild.voiceConnection) {
  			message.channel.sendMessage('I\'m already in a voice channel');
  		} else {
  			message.channel.sendMessage('Joining...').then(() => {
  				voiceChan.join().then(() => {
  					message.channel.sendMessage('Joined successfully.').catch(error => message.channel.sendMessage(error));
  				}).catch(error => message.channel.sendMessage(error));
  			}).catch(error => message.channel.sendMessage(error));
  		}
  	} else

  	if (message.content.startsWith(prefix + 'leave')) {
  		let voiceChan = message.member.voiceChannel;
  		if (!voiceChan) {
  			message.channel.sendMessage('I am not in a voice channel');
  		} else {
  			message.channel.sendMessage('Leaving...').then(() => {
  				voiceChan.leave();
  			}).catch(error => message.channel.sendMessage(error));
  		}
  	}
});

client.on('guildMemberSpeaking', (member, speaking) => {
  let guild = member.guild;
  if (member.speaking) {
    guild.defaultChannel.sendMessage(`:wave: ${member.user.username}`);
  }
});*/


client.login(token);

client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
client.on('debug', (e) => console.info(e));

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
});