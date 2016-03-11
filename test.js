/*jslint plusplus: true, node:true, devel: true */
/*global */

"use strict";
//var run = require('./matchNumberRangeRegex.js');
//console.log(run.fromTolerance(1000, 2, 0));
//console.log(run.fromTolerance(562500000, "3%", 6, false));

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
toRegEx(possibleNumbers);

possibleNumbers = [
   "100",
   "200",
   "300",
   "400",
   "500"
];
toRegEx(possibleNumbers);