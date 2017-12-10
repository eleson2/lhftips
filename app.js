//App = require('express')();
cheerio = require('cheerio');
request = require('request');
pageParser = require('./pageParser');
cmdl = require('command-line-args');

const optionDefinitions = [
  { name: 'url', alias: 'u', type: String,  defaultValue: 'empty' }
] ;
  
const options = cmdl(optionDefinitions);

if (options.url == 'empty' ) {
  options.url ='http://www.luleahockeyforum.com/t1396p400-tipstavling-lulea-hockeys-grundseriematcher-2017-2018';
}

  VotePage = {
  method: 'GET',
  url: options.url
};
// http://www.luleahockeyforum.com/t1396p400-tipstavling-lulea-hockeys-grundseriematcher-2017-2018
// http://www.luleahockeyforum.com/t1396p350-tipstavling-lulea-hockeys-grundseriematcher-2017-2018

console.log('PostID,UserID,GameDate,Game,Guess,Scorer');
request(VotePage, 
  pageParser);