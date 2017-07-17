const responses = [
  "As I see it, yes.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "It is certain.",
  "It is decidely so.",
  "Most likely.",
  "My reply is no.",
  "My sources say no.",
  "Outlook good.",
  "Outlook not so good.",
  "Reply hazy, try again.",
  "Signs point to yes.",
  "Very doubtful.",
  "Without a doubt.",
  "Yes",
  "Yes, definitely.",
  "You may rely on it."
];
exports.run = (client, message, params) => {
  if (!params[0]) {
    return message.channel.send("The Magic Kippibot 8-ball cannot predict a blank fortune.");
  }
  var resNum = Math.floor(Math.random() * responses.length);
  var msg = "The Magic Kippibot 8-ball predicts... " + responses[resNum];
  return message.channel.send(msg, {code: 'css'});
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
exports.help = {
  name: "8ball",
  description: "Need your fortune told? Have a yes/no question? Find out the 100% true results!",
  usage: "+8ball"
};
