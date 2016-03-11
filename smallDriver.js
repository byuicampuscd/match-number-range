/*jslint plusplus: true, node:true */
/*global */
"use strict";

var matchNumberRange = require('./matchNumberRangeRegex.js'),
   assert = require('assert'),
   regExText,
   regEx;

function makeErrorMessage(testName, checkName) {
   return testName + ": Regular expression didn't match " + checkName + " check.";

}

function runTest(test, regExText) {
   var regEx = new RegExp(regExText);

   assert(regExText === test.regex, makeErrorMessage(test.name, "expected output"));
   assert(regEx.test(test.upper) === true, makeErrorMessage(test.name, "upper bound"));
   assert(regEx.test(test.lower) === true, makeErrorMessage(test.name, "lower bound"));
   assert(regEx.test(test.mid) === true, makeErrorMessage(test.name, "mid"));
   assert(regEx.test(test.outUpper) === false, makeErrorMessage(test.name, "outside upper bound"));
   assert(regEx.test(test.outLower) === false, makeErrorMessage(test.name, "ouside lower bound"));
   console.log('PASSED: ' + test.name);
   console.log('\t' + regExText);
}

function runToleranceTest(test) {
   runTest(test, matchNumberRange.fromTolerance(test.values.ans, test.values.tol, test.values.dec));
}

function runBoundsTest(test) {
   runTest(test, matchNumberRange.fromBounds(test.values.upper, test.values.lower, test.values.dec));
}

var testsTol = [{
   name: "Negative to Positive",
   values: {
      ans: 0,
      tol: 15,
      dec: 1
   },
   regex: '^\\s*(?:-1(?:[0-4]\\.[0-9]|5\\.0)|-(?:0\\.[1-9]|[1-9]\\.[0-9])|[0-9]\\.[0-9]|1(?:[0-4]\\.[0-9]|5\\.0))\\d*\\s*$',
   upper: '15.0',
   lower: '-15.0',
   mid: '1.02',
   outUpper: '15.1',
   outLower: '-15.1'
}, {
   name: "Negative to Positive w/percent",
   values: {
      ans: 10,
      tol: '200%',
      dec: 0
   },
   regex: '^\\s*(?:-10|-[1-9]|[0-9]|[12][0-9]|30)(?:\\.\\d*)?\\s*$',
   upper: '30',
   lower: '-10',
   mid: '1',
   outUpper: '31.25',
   outLower: '-11'
}];

testsTol.forEach(function (test) {
   runToleranceTest(test);
});

var testsBounds = [{
   name: "Negative to Positive with bounds",
   values: {
      upper: 15.0,
      lower: -15.0,
      dec: 1
   },
   regex: '^\\s*(?:-1(?:[0-4]\\.[0-9]|5\\.0)|-(?:0\\.[1-9]|[1-9]\\.[0-9])|[0-9]\\.[0-9]|1(?:[0-4]\\.[0-9]|5\\.0))\\d*\\s*$',
   upper: '15.0',
   lower: '-15.0',
   mid: '1.2',
   outUpper: '15.1',
   outLower: '-15.1'
}];

testsBounds.forEach(function (test) {
   runBoundsTest(test);
});

//console.log(regEx);

//test numbers like 560 to 2 sigfigs js make it 5.6e2 check here http://jsfiddle.net/K5GRb/