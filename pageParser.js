/*
 * Programmet scaannar gissningar från websidan.
 * Anv:  node pageParser
 * 
 * Rader som har ett felaktigt format markeras med ===.  
 * Producerad utfil behover editeras och justeras 
*/
cheerio = require('cheerio');
 

function listfunc(i,element) {
    var a = wPage(element);

    // replace  nbsp's with blanks
    var User = a.children('p.author').text().split(String.fromCharCode(160)).join(' ').split(' ')[2];
    var Guess = a.children('div.clearfix.content').text().split(String.fromCharCode(160)).join(' ').trim();
    var PostID = a.prev().attr('id'); // ('class.post.row2').attr('id');
    
    // remove non-result posts.
    if (Guess.substring(0,3) != '201' ) {
        console.log('=== ' + PostID + ' <<< Not a Guess. >>>:' + Guess);
        return;
    }

    strlen = Guess.length;    
    for (;strlen--;) { // return index of 
        if (Guess[strlen] >='0' && Guess[strlen] <= '9') break;
        if (strlen < 0) exit;
    }
    strlen++;
    Shooter = Guess.substring(strlen).replace(',','').trim();
    Guess = Guess.substring(0,strlen).replace(/ /g,'');

    // Include lineno to make then unique if multiple bets.
    line = PostID + ',' + User + ',' + Guess+','+Shooter; 

    // line should have four commas, if not, mark them with ===.
    if ( (line.match(/,/g) || []).length != 5) line ='===' + line;
    console.log(line);
}

function pageP (err, response, body){
    if (err) return console.error(err);
    wPage = cheerio.load(body);
    wPage('div.postbody').each(listfunc);
}
module.exports = pageP;

