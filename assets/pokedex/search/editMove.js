const fs = require('fs');
module.exports = (message, params, dexDir) => {
  //C:\\Users\\caron\\Kippibot-Discord\\assets\\pokedex\\move
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


/*fs.readdir('C:\\Users\\caron\\Kippibot-Discord\\assets\\pokedex\\move', (err, files) => {
  //var moveFile = JSON.parse(fs.readFileSync('C:\\Users\\caron\\Kippibot-Discord\\moves.json', 'utf8'));
  var i = 0;
  var moveFile;
  files.forEach(file => {
    moveFile = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log((file.substring(0, file.length - 5)) + ": " + moveFile.index_number);
    //moveFile.moves.push(file.substring(0, file.length - 5));
  });
  fs.writeFile('C:\\Users\\caron\\Kippibot-Discord\\moves.json', JSON.stringify(moveFile, null, 2), (err) => {
    if (err) console.log("error.");
  });
});

//var moveFile = JSON.parse(fs.readFileSync('C:\\Users\\caron\\Kippibot-Discord\\moves.json', 'utf8'));
//client.channels.get(201593903453962240).send(moveFile.moves.length);

var moveFile = JSON.parse(fs.readFileSync('C:\\Users\\caron\\Kippibot-Discord\\moves.json', 'utf8'));
for (var i = 0; i < moveFile.moves.length; i++) {
  var lastIndx = moveFile.moves.lastIndexOf(moveFile.moves[i]);
  if (i !== moveFile.moves.lastIndexOf(moveFile.moves[i])) moveFile.moves[lastIndx] = "duplicate";
}
fs.writeFile('C:\\Users\\caron\\Kippibot-Discord\\moves.json', JSON.stringify(moveFile, null, 2), (err) => {
  if (err) console.log("error.");
});
console.log(moveFile.moves.length);
*/
