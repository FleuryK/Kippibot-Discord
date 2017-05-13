module.exports = (message, params, dexDir, fs) => {
  let client = message.client;
  var moveDir = './assets/pokedex/move/';
  client.user.setGame(params[1]);
  var id = parseInt(params[1], 10);
  if (isNaN(id)) { return message.channel.send("That's not a number!"); }
  var description = params.slice(2).join(" ");
  var move = "";
  var moveFile;
  fs.readdir(moveDir, (err, files) => {
    files.forEach(file => {
      moveFile = JSON.parse(fs.readFileSync(moveDir + file, 'utf8'));
      if (id === moveFile.index_number) {
        //return console.log(moveFile.descriptions.en);
        //console.log(moveFile.names.en);
        move = file.substring(0, file.length - 5);
        message.channel.send(`Editing Move: ${move} with description: ${description}`)
        .then(msg => {
          dexDir = dexDir + `move/${move}.json`;
          var newFile = JSON.parse(fs.readFileSync(dexDir, 'utf8'));
          newFile.descriptions.en = description;
          fs.writeFile(dexDir, JSON.stringify(newFile, null, 2), (err) => {
            if (err) {
              msg.edit(`Move ${move} was not edited successfully. :(`);
              msg.delete(3000);
              message.delete(3000);
            }
            else {
              msg.edit(`Move ${move} was edited successfully! :D`);
              message.delete(3000);
            }
          });
        });
      }
    });
  });
}
