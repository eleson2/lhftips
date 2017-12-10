csv = require("csvtojson");
db = require("sqlite-sync");

/*
 * Programmet äser in gissningar från stdin.
 * Anv:  node loadGuesses < guesses.txt
 * guesses.txt - fomat:
 * PostID,UserID,GameDate,Game,Guess,Scorer
 * 205677,PM,2017-11-02,Luleå-Hv71,3-2,Harju
 * === 205776 <<< Not a Guess.  |Res| Reserverat.
 * 205842,Kapten,2017-11-14,Luleå-Färjestad,3-2,Harju.Dags för en ytterligare uddamålsvinst!
 * 205849,Bamsefar,2017-11-14,Luleå-Färjestad,4-2,Cehlin
 * ===205948,HarryHaffa,20171114.Luleå-Färjestad3-2,Patrick Cehlin
 * ...
 * 
 * Rader som börjar med === har ett felaktigt
 *  format och läses inte in.  
*/


db.connect("./db/oh2.db");

stmt1 = "select count(*) as nmbr from guesses where postid = ?";

stmt2 = "Insert into guesses " +
"        (postid, UserID, gameDate, game, guess, homeScore, awayScore, Scorer) " +
"values  (?, ?, ?, ?, ?, ?, ?, ? )"  ;

stmt3 = "update guesses set ScorerPoint = ? where postid = ?";


function rowHandler(Row) {  // PostID,User,GameDate,Game,Guess,Scorer
  // skip invalid lines
  if ( Row.PostID.substring(0,3) == "===") {
    return;
  }
  if ( Row.PostID < 0 ) {
    Scorer=1;
    Row.PostID =  - Row.PostID;
  }
  else {
    Scorer = 0;
  }

  var found = db.run(stmt1, [Row.PostID])[0].nmbr;
  
  if (!found) { // ok, insert it then
    var R = Row.Guess.split("-");
    var post = [Number(Row.PostID), 
      Row.UserID, 
      Row.GameDate, 
      Row.Game, 
      Row.Guess,
      Number(R[0]),
      Number(R[1]),
      Row.Scorer,] ;
    var last_id = db.run(stmt2, post);
  }

  //  TTT= db.run(stmt3,[Scorer, Number(Row.PostID)]);
  TTT= db.run(stmt3,[Scorer, Row.PostID]);

}

function endGame() {
//
// Vyn valid_guess visar den sista gissningen 
// från en användare.
// Alla tidigare gissningar rensas bort.    
/*
  db.run( 'Delete from guesses ' +
        'where guesses.PostID not in' +
        '   (  select  postID from valid_guess GV' +
        '      where   guesses.gameDate = GV.gameDate' +
        '      and     guesses.UserID = GV.UserID' +
        '   )'
);
*/
//  Slut för idag.
  db.close();
}

csv()
  .fromStream(process.stdin)
  .on("json", rowHandler)
  .on("done", endGame);
  