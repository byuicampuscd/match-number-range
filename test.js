/*jslint plusplus: true, node:true, devel: true */
/*global */

"use strict";
var run = require('./matchNumberRangeRegex.js');
//console.log(run.fromTolerance(0.00001234, "3%", -8));
console.log(run.fromTolerance(12340, "3%", 1));
//console.log(run.fromTolerance(562500000, "3%", 6, false));
/*
function trieFromList(list) {
   var Trie = require('trie-hard'),
      trie = new Trie();

   //put them in
   list.forEach(function (item) {
      trie.add(item);
   });
   return trie.toObject();
}

function toRegEx(list) {
   var obj = trieFromList(list);
   console.log("obj:", JSON.stringify(obj, null, " "));
   console.log();
   console.log(require('./trieToRegEx.js')(obj));
}

var possibleNumbers;
possibleNumbers = [
   "0.000",
   "0.001",
   "0.002",
   "0.003",
   "0.004",
   "0.005",
   "0.006",
   "0.007",
   "0.008",
   "0.009",
   "1.003",
   "1.0091",
   "1.0090",
   "100",
   "200",
   "300",
   "400",
   "500"
];
//toRegEx(possibleNumbers);

possibleNumbers = [
   "100",
   "200",
   "300",
   "400",
   "500"
];
//toRegEx(possibleNumbers);

function test(numText, numOfDigits) {
   return numText.substr(0, numText.length + numOfDigits) + '.' + numText.substr(numOfDigits);
}
var i,
   text = '1234';
for (i = 1; i <= text.length; ++i) {
   console.log('i:', test(text, -i));
}
*/