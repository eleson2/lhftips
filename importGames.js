/*
 * Programmet laddar in säsongens matcher, 
 * eller åtminstone de som finns läses från stdin.
 * Anv:  node importGames < matcher.txt
 * matcher.txt - fomat:
 * gameDate, Description, homeScore, awayScore, homeWi
 * 2017-09-01,fhc,0,0,0
 * ...  
*/
csv = require('csvtojson');
db = require('sqlite-sync');

db.connect('./db/oh2.db');

stmt = 'Insert into games ' +
'        (gameDate, Description) ' +
'values  (?, ? )'  ;

function rowHandler(Row) {  // PostID,User
  console.log(Row);
  var last_id = db.run(stmt, Row);
};

function endGame() {
  //  Slut för idag.
  db.close();
};

csv()
  .fromStream(process.stdin)
  .on('csv', rowHandler)
  .on('done', endGame);