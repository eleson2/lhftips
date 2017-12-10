/*
 * Programmet uppdaterar matchtabellen med resultat.
 * Anv:  node resultat -d 2017-11-15 -h 4 -b 3
 * 
*/
db = require('sqlite-sync');
cmdl = require('command-line-args');

const optionDefinitions = [
  { name: 'FromDate', alias: 'b', type: String, defaultValue: '1999-01-01' }, //
  { name: 'ToDate',   alias: 'e', type: String, defaultValue: '2099-12-31' }  // 
] ;

const options = cmdl(optionDefinitions);

db.connect('./db/oh2.db');

stmt = 'select userID, sum(Points+ScorerPoint) as Score ' +
'       from guesses ' +
'       where gameDate between ? AND ? ' +
'       group by UserID  order by Score DESC';

var result = db.run(stmt,[options.FromDate, options.ToDate]);

// calculate point for guesses.

for (i=0, len = result.length; i< len; i++){
  console.log(result[i].UserID.padStart(20).padEnd(25) , result[i].Score);
}
//  Slut för idag.
db.close();