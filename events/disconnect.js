module.exports = client => {
  client.log("EVENT", `${client.user.username} was disconnected at ${new Date()}) T_T`);
};
