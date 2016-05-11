/*jslint plusplus: true, node:true */
/*global */
"use strict";

module.exports = (function () {
   function numberToString(number, numOfDigits) {
      function repeat(char, length) {
         var i, strOut = '';
         for (i = 0; i < length; ++i) {
            strOut += char;
         }
         return strOut;
      }

      var numText, sign;

      //get the sign and then kill it
      sign = 1 / number > 0 ? '' : '-';
      number = Math.abs(number);

      //now make text
      numText = number.toFixed(0);

      //left or right of decimal
      if (numOfDigits < 0) {
         //is the point in the number or not 
         if (Math.abs(numOfDigits) >= numText.length) {
            return sign + '0?.' + repeat('0', Math.abs(numOfDigits) - numText.length) + numText;
         } else {
            //the point is in the number
            //numOfDigits is negitive so
            return sign + numText.substr(0, numText.length + numOfDigits) + '.' + numText.substr(numOfDigits);
         }
      } else {
         return sign + numText + repeat('d', numOfDigits);
      }
   }

   function makeList(bounds, numOfDigits) {
      function itemIndexFromEnd(possibleNumbers, item) {
         var index = possibleNumbers.length,
            i;
         for (i = possibleNumbers.length - 1; i > -1; i -= 1) {
            if (possibleNumbers[i].text === item.text && i < index) {
               index = i;
            }
         }

         return index;
      }

      var i,
         possibleNumbers = [];

      //make text counter parts
      for (i = bounds.lower; i <= bounds.upper; ++i) {
         //This makes sure that -0 gets added to the list when for numbers like -0.0\d*
         if (i === 0 && bounds.lower < 0 && bounds.upper >= 0) {
            possibleNumbers.push({
               num: -0,
               text: numberToString(-0, numOfDigits)
            });
         }

         possibleNumbers.push({
            num: i,
            text: numberToString(i, numOfDigits)
         });

      }

      return possibleNumbers;
   }

   function makeCuts(possibleNumbers) {
      function cutNow(item, nextItem) {

         //at end of array
         if (typeof nextItem === 'undefined') {
            return true;
         }

         //Length changes
         if (item.text.length !== nextItem.text.length) {
            return true;
         }

         return false;
      }
      var lastCut = 0,
         listOfLists = [],
         i;

      for (i = 0; i < possibleNumbers.length; ++i) {
         if (cutNow(possibleNumbers[i], possibleNumbers[i + 1])) {
            listOfLists.push(possibleNumbers.slice(lastCut, i + 1));
            lastCut = i + 1;
         }
      }
      return listOfLists;
   }

   function trieFromList(list) {
      var Trie = require('trie-hard'),
         trie = new Trie();

      //put them in
      list.forEach(function (item, count) {
         trie.add(item.text);
      });

      return trie.toObject();
   }

   // addEnd is used to attach the ending to allow for extra digits past required presicion 
   function addEnd(text) {
      var reg = '';
      if (text.indexOf('.') !== -1) {
         reg = text + '\\d*\\s*';
      } else {
         reg = text + '(?:\\.\\d*)?\\s*';
      }
      return reg;

   }

   function process(bounds, numOfDigits) {
      var possibleNumbers,
         possiblesCutUp,
         listOfRegEx = [],
         trieToRegEx = require('./trieToRegEx.js'),
         regExOut;

      //make the list
      possibleNumbers = makeList(bounds, numOfDigits);

      //cut it up in to legal lists 
      possiblesCutUp = makeCuts(possibleNumbers);

      //regexs from lists
      possiblesCutUp.forEach(function (list) {
         listOfRegEx.push(trieToRegEx(trieFromList(list)));
      });

      regExOut = '(?:' + listOfRegEx.join('|') + ')';
      // addEnd is used to attach the ending to allow for extra digits past required presicion 
      regExOut = addEnd(regExOut);
      return '^\\s*' + regExOut + '$';
   }

   function scale(number, numOfDigits) {
      function trunc(number) {
         if (number < 0) {
            return Math.ceil(number);
         }
         return Math.floor(number);
      }

      if (numOfDigits < 0) {
         //scale up
         number = number * Math.pow(10, Math.abs(numOfDigits));
      } else {
         //scale down
         if (number.toFixed(0).length <= numOfDigits) {
            throw "numOfDigits is too high. number: " + number + " numOfDigits: " + numOfDigits;
         }
         number = number / Math.pow(10, numOfDigits);
      }

      //chop the decmal part
      return trunc(number);
   }

   function scaleBounds(bounds, numOfDigits) {

      function scale(number, numOfDigits) {
         if (numOfDigits < 0) {
            //scale up
            number = number * Math.pow(10, Math.abs(numOfDigits));
         } else {
            //scale down
            if (number.toFixed(0).length <= numOfDigits) {
               throw "numOfDigits is too high. number: " + number + " numOfDigits: " + numOfDigits;
            }
            number = number / Math.pow(10, numOfDigits);
         }
         return number;
      }

      //scale the numbers
      bounds.upper = scale(bounds.upper, numOfDigits);
      bounds.lower = scale(bounds.lower, numOfDigits);
   }

   function makeBounds(lower, upper, numOfDigits) {
      var bounds;

      //make sure they are in the correct order
      if (lower <= upper) {
         bounds = {
            lower: lower,
            upper: upper
         };
      } else {
         bounds = {
            lower: upper,
            upper: lower
         };
      }

      scaleBounds(bounds, numOfDigits);

      //round by expanding
      bounds = {
         lower: Math.floor(bounds.lower),
         upper: Math.ceil(bounds.upper)
      };

      bounds.diff = bounds.upper - bounds.lower;

      return bounds;
   }

   function makeBoundsFromTol(answer, tolerance, numOfDigits) {
      var lower, 
          upper, 
          tol;     
         
      if (typeof tolerance === 'string' && tolerance.trim().charAt(tolerance.length - 1) === '%') {
         //if it is a percent
         tol = parseFloat(tolerance) / 100 * answer;
         
      } else if (typeof tolerance === 'number' && !isNaN(tolerance)) {
         //if is just a number
         tol = tolerance;
         console.log("ya");
      } else {
         console.log("Error:", typeof tolerance, answer);
         throw "Invalid tolerance";
      }

      //get base Bounds
      return makeBounds(answer - tol, answer + tol, numOfDigits);
   }

   function fromTolerance(answer, tolerance, numOfDigits) {
      var bounds = makeBoundsFromTol(answer, tolerance, numOfDigits);
      //console.log("bounds:", bounds);
      //console.log("bounds diff:", bounds.upper - bounds.lower);
      return process(bounds, numOfDigits);
   }

   function fromBounds(lower, upper, numOfDigits) {
      var bounds = makeBounds(lower, upper, numOfDigits);
      //console.log("bounds:", bounds);
      //console.log("bounds diff:", bounds.upper - bounds.lower);
      return process(bounds, numOfDigits);
   }

   return {
      fromTolerance: fromTolerance,
      fromBounds: fromBounds
   };

}());