module.exports = client => {
  client.log("INFO", 'Logged in! :)');
  client.log("INFO", `Listening on ${client.guilds.size} servers (${client.channels.size} channels)`);
  client.user.setGame("Version: Beta 1.0");
  client.user.setStatus('online');
};
