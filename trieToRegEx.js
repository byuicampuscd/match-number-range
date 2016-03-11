/*jslint plusplus: true, node:true */
"use strict";

module.exports = (function () {
   function getKeys(obj) {
      return Object.keys(obj).sort();
   }

   //this groups the nodes at the same level that have the same kids
   function combindEquals(converted) {
      var outerI, innerI, deepEq = require('deep-Equal');

      for (outerI = 0; outerI < converted.length; ++outerI) {
         if (!converted[outerI].deleteMe) {
            for (innerI = outerI + 1; innerI < converted.length; ++innerI) {
               if (!converted[innerI].deleteMe) {
                  //if they have the same kids then just hold on to the char
                  if (deepEq(converted[outerI].kids, converted[innerI].kids)) {
                     converted[outerI].chars = converted[outerI].chars.concat(converted[innerI].chars);
                     converted[innerI].deleteMe = true;
                  }
               }
            }
         }
      }

      //take out the deleted ones
      converted = converted.filter(function (item, count) {
         return item.deleteMe !== true;
      });

      //loop the kids
      converted.forEach(function (item) {
         if (item.kids) {
            item.kids = combindEquals(item.kids);
         }
      });

      return converted;

   }

   //this converts the trie in to a trie that uses arrays instead of objs
   function convert(trie) {
      var keys = getKeys(trie);
      return keys.map(function (key) {
         var objOut = {
            chars: [key]
         };

         if (trie[key] === 1) {
            return objOut;
         } else if (typeof trie[key] === 'object') {
            objOut.kids = convert(trie[key]);
            return objOut;
         }
         //just incase to see error
         return 'error';

      });
   }

   //check if a char is on the naughty list and escape it
   function excape(char, isInCharSet) {
      var badAlways = ['.'],
         badInCharSet = ['-'],
         excapeChar = '';
      //badInCharSet needs to have all
      badInCharSet = badInCharSet.concat(badAlways);

      //check if they are on the naughty list
      if (isInCharSet && badInCharSet.indexOf(char) !== -1) {
         excapeChar = '\\';
      } else if (!isInCharSet && badAlways.indexOf(char) !== -1) {
         excapeChar = '\\';
      }

      return excapeChar + char;
   }

   function justNumsToCharSet(justNums) {
      function toText(arr) {
         if (arr.length > 2) {
            return arr[0] + '-' + arr[arr.length - 1];
         } else {
            return arr.join('');
         }
      }

      //to check if we have no missing first is almost the same as if we just guarantee it
      var lastIndex = justNums.length - 1,
         groupsOfNoMissing = [],
         lastCut = 0,
         textOut = '';

      //if array is short there can't be any missing, return
      if (lastIndex < 2) {
         return toText(justNums);
      }

      //make groups of no missing
      justNums.forEach(function (item, count) {
         //cut at missing
         if (count === lastIndex || Number(item) + 1 !== Number(justNums[count + 1])) {
            groupsOfNoMissing.push(justNums.slice(lastCut, count + 1));
            lastCut = count + 1;
         }

      });

      //make the text from the list
      groupsOfNoMissing.forEach(function (group) {
         if (group.length > 1) {
            textOut += toText(group);
         } else {
            textOut += group.toString();
         }
      });

      return textOut;
   }

   //makes regular expresions that look like [0-9] or the negitive sign or the decimal point
   function makeCharSet(list) {
      function numEqIndex(num, index) {
         return +num === index;
      }

      var justNums, notNums,
         textOut = '',
         inCharSet = list.length > 1;

      justNums = list.filter(function (item) {
         return item.match(/\d/) !== null;
      });

      notNums = list.filter(function (item) {
         return item.match(/\d/) === null;
      });

      //DO THE NUMBERS
      //check if we have them all and output a \d instead
      if (justNums.length === 10 && justNums.every(numEqIndex)) {
         textOut += "\\d";
         inCharSet = false;
      } else {
         textOut += justNumsToCharSet(justNums);
      }

      //put notNumbs too
      if (notNums.length > 0) {
         notNums.forEach(function (item) {
            textOut += excape(item, inCharSet);
         });
      }
      if (inCharSet) {
         return '[' + textOut + ']';
      }
      return textOut;
   }

   function toRegEx(list) {
      return list.map(function (item) {
         var textOut = makeCharSet(item.chars),
            kids;
         if (item.kids) {
            kids = toRegEx(item.kids);
            if (kids.length > 1) {
               textOut += '(?:' + toRegEx(item.kids).join('|') + ')';
            } else {
               textOut += kids[0];
            }
         }
         // addEnd is used to attach the optional ending for extra digits past required presicion 
         return textOut;
      });
   }

   function debug(trie, converted, pairedDown, regExList, regExOut) {

      console.log('TRIE ------------------');
      console.dir(trie);
      console.log('Converted ------------------');
      console.dir(converted, {
         depth: null
      });
      console.log('pairedDown ------------------');
      console.dir(pairedDown, {
         depth: null
      });
      console.log('regExList ------------------');
      console.log(regExList);
      console.log('regExOut ------------------');
      console.log(regExOut);
      console.log('END ------------------');
   }

   return function (trie) {
      var converted, pairedDown, regExList, regExOut;

      converted = convert(trie);
      pairedDown = combindEquals(converted);
      regExList = toRegEx(pairedDown);

      regExOut = regExList.join('|');

      //debug(trie, converted, pairedDown, regExList, regExOut);
      return regExOut;
   };
}());