/*
 * Programmet uppdaterar matchtabellen med resultat.
 * Anv:  node resultat -d 2017-11-15 -h 4 -b 3
 * 
*/
db = require('sqlite-sync');
cmdl = require('command-line-args');

const optionDefinitions = [
  { name: 'datum', alias: 'd', type: String },
  { name: 'hemma', alias: 'h',  type: Number, defaultValue: 0 },
  { name: 'borta', alias: 'b', type: Number, defaultValue: 0 }
] ;

const options = cmdl(optionDefinitions);

db.connect('./db/oh2.db');

stmt = 'update games set homeGoals = ' + options.hemma +', awayGoals = ' + options.borta +
'       where gameDate = \'' + options.datum +'\';' ;

var update = db.run(stmt);

// calculate point for guesses.

stmt = 'select * from valid_guess where gameDate = ?';
var result = db.run(stmt,[options.datum]);

stmt = 'update guesses set points = ? where postid = ?';

for (i=0, len = result.length; i< len; i++){
  score = 0;
  winnerGuess = result[i].homeScore - result[i].awayScore;
  winnerResult = options.hemma - options.borta; 
  
  if (result[i].awayScore == options.borta) score +=1;
  if (result[i].homeScore == options.hemma) score +=1;
  if (score == 2) score +=3;
  if ((winnerGuess*winnerResult) >0 ) score +=1;
  
  db.run(stmt,[score,result[i].postid]);
}
//  Slut för idag.
db.close();
