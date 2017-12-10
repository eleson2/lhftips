/*
 * Programmet uppdaterar matchtabellen med resultat.
 * Anv:  node resultat -d 2017-11-15 -h 4 -b 3
 * 
*/
db = require("sqlite-sync");
cmdl = require("command-line-args");

const optionDefinitions = [
  { name: "FromDate", alias: "b", type: String, defaultValue: "1999-01-01" }, //
  { name: "ToDate",   alias: "e", type: String, defaultValue: "2099-12-31" }  // 
] ;

const options = cmdl(optionDefinitions);

db.connect("./db/oh2.db");

stmt1 = "select gameDate, homeGoals, awayGoals from games where gameDate between '" + 
         options.FromDate +"' and '" + options.ToDate + "';" ;

stmt2 = "select * from valid_guess where gameDate = ?";

stmt3 = "update guesses set points = ? where postid = ?";

var gamesToUpdate = db.run(stmt1);

// calculate point for guesses.
for(j=0, len1 = gamesToUpdate.length; j< len1 ; j++) {
  var result = db.run(stmt2,[gamesToUpdate[j].gameDate]);

  for (i=0, len2 = result.length; i< len2; i++) {
    score = 0;
    winnerGuess = result[i].homeScore - result[i].awayScore;
    winnerResult = gamesToUpdate[j].homeGoals - gamesToUpdate[j].awayGoals;
        
    if (result[i].awayScore == gamesToUpdate[j].awayGoals) score +=1;
    if (result[i].homeScore == gamesToUpdate[j].homeGoals) score +=1;
    if (score == 2) score +=3;
    if ((winnerGuess*winnerResult) >0 ) score +=1;
    
    db.run(stmt3,[score,result[i].postid]);
  }
}//  Slut för idag.
db.close();
