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

   console.log('\t' + regExText);
   assert(regExText === test.regex, makeErrorMessage(test.name, "expected output"));
   assert(regEx.test(test.upper) === true, makeErrorMessage(test.name, "upper bound"));
   assert(regEx.test(test.lower) === true, makeErrorMessage(test.name, "lower bound"));
   assert(regEx.test(test.mid) === true, makeErrorMessage(test.name, "mid"));
   assert(regEx.test(test.outUpper) === false, makeErrorMessage(test.name, "outside upper bound"));
   assert(regEx.test(test.outLower) === false, makeErrorMessage(test.name, "ouside lower bound"));
   console.log('\tPASSED');
}

function runToleranceTest(test) {
   console.log('RUNNING: ' + test.name);
   runTest(test, matchNumberRange.fromTolerance(test.values.ans, test.values.tol, test.values.dec, test.values.needZero));
}

function runBoundsTest(test) {
   console.log('RUNNING: ' + test.name);
   runTest(test, matchNumberRange.fromBounds(test.values.upper, test.values.lower, test.values.dec, test.values.needZero));
}

var testsTol = [{
   name: "Large Range Number",
   values: {
      ans: 130.25,
      tol: 45,
      dec: 2,
      needZero: false
   },
   regex: '^\\s*(?:8(?:5\\.(?:2[5-9]|[3-9][0-9])|[6-9]\\.[0-9][0-9])|9[0-9]\\.[0-9][0-9]|1(?:[0-6][0-9]\\.[0-9][0-9]|7(?:[0-4]\\.[0-9][0-9]|5\\.(?:[01][0-9]|2[0-5]))))\\d*\\s*$',
   upper: '175.25',
   lower: '85.25',
   mid: '100.25',
   outUpper: '175.26',
   outLower: '85.20'
}, {
   name: "Large Range Number w/percent",
   values: {
      ans: 130.25,
      tol: '45%',
      dec: 2,
      needZero: false
   },
   regex: '^\\s*(?:7(?:1\\.(?:6[4-9]|[7-9][0-9])|[2-9]\\.[0-9][0-9])|[89][0-9]\\.[0-9][0-9]|1(?:[0-7][0-9]\\.[0-9][0-9]|8(?:[0-7]\\.[0-9][0-9]|8\\.(?:[0-7][0-9]|8[0-6]))))\\d*\\s*$',
   upper: '188.86',
   lower: '71.64',
   mid: '100.25',
   outUpper: '188.87',
   outLower: '71.60'
}, {
   name: "Small Number Optional Zero",
   values: {
      ans: 0.0005639,
      tol: 0.000005,
      dec: 7,
      needZero: false
   },
   regex: '^\\s*(?:0?\\.0005(?:5(?:89|9[0-9])|6[0-8][0-9]))\\d*\\s*$',
   upper: '0.0005689',
   lower: '0.0005589',
   mid: '0.0005600',
   outUpper: '0.0005690',
   outLower: '0.0005588'
}, {
   name: "Small Number Required Zero",
   values: {
      ans: 0.0005639,
      tol: 0.000005,
      dec: 7,
      needZero: true
   },
   regex: '^\\s*(?:0\\.0005(?:5(?:89|9[0-9])|6[0-8][0-9]))\\d*\\s*$',
   upper: '0.0005689',
   lower: '0.0005589',
   mid: '0.0005600',
   outUpper: '0.0005690',
   outLower: '0.0005588'
}, {
   name: "Small Number w/Percent Optional Zero",
   values: {
      ans: 0.0005639,
      tol: '5%',
      dec: 7,
      needZero: false
   },
   regex: '^\\s*(?:0?\\.0005(?:3(?:5[7-9]|[6-9][0-9])|[4-8][0-9][0-9]|9(?:[01][0-9]|2[01])))\\d*\\s*$',
   upper: '0.0005639',
   lower: '0.0005357',
   mid: '0.0005501',
   outUpper: '0.0005922',
   outLower: '0.0005350'
}, {
   name: "Small Number w/Percent Required Zero",
   values: {
      ans: 0.0005639,
      tol: '5%',
      dec: 7,
      needZero: true
   },
   regex: '^\\s*(?:0\\.0005(?:3(?:5[7-9]|[6-9][0-9])|[4-8][0-9][0-9]|9(?:[01][0-9]|2[01])))\\d*\\s*$',
   upper: '0.0005639',
   lower: '0.0005357',
   mid: '0.0005501',
   outUpper: '0.0005922',
   outLower: '0.0005350'
}, {
   name: "Negative to Positive Optional Zero",
   values: {
      ans: 0,
      tol: 15,
      dec: 1,
      needZero: false
   },
   regex: '^\\s*(?:-1(?:[0-4]\\.[0-9]|5\\.0)|-(?:0\\.[1-9]|[1-9]\\.[0-9])|[0-9]\\.[0-9]|1(?:[0-4]\\.[0-9]|5\\.0))\\d*\\s*$',
   upper: '15.0',
   lower: '-15.0',
   mid: '1.02',
   outUpper: '15.1',
   outLower: '-15.1'
}, {
   name: "Negative to Positive Required Zero",
   values: {
      ans: 0,
      tol: 15,
      dec: 1,
      needZero: true
   },
   regex: '^\\s*(?:-1(?:[0-4]\\.[0-9]|5\\.0)|-(?:0\\.[1-9]|[1-9]\\.[0-9])|[0-9]\\.[0-9]|1(?:[0-4]\\.[0-9]|5\\.0))\\d*\\s*$',
   upper: '15.0',
   lower: '-15.0',
   mid: '1.02',
   outUpper: '15.1',
   outLower: '-15.1'
}, {
   name: "Negative to Positive w/percent Optional Zero",
   values: {
      ans: 10,
      tol: '200%',
      dec: 0,
      needZero: false
   },
   regex: '^\\s*(?:-10|-[1-9]|[0-9]|[12][0-9]|30)(?:\\.\\d*)?\\s*$',
   upper: '30',
   lower: '-10',
   mid: '1',
   outUpper: '31.25',
   outLower: '-11'
}, {
   name: "Negative to Positive w/percent Required Zero",
   values: {
      ans: 10,
      tol: '200%',
      dec: 0,
      needZero: true
   },
   regex: '^\\s*(?:-10|-[1-9]|[0-9]|[12][0-9]|30)(?:\\.\\d*)?\\s*$',
   upper: '30',
   lower: '-10',
   mid: '1',
   outUpper: '31.25',
   outLower: '-11'
}, {
   name: "Large Num w/Decimal",
   values: {
      ans: 4005020.2,
      tol: 200,
      dec: 1
   },
   regex: '^\\s*(?:400(?:4(?:8(?:2(?:0\\.[2-9]|[1-9]\\.[0-9])|[3-9][0-9]\\.[0-9])|9[0-9][0-9]\\.[0-9])|5(?:[01][0-9][0-9]\\.[0-9]|2(?:[01][0-9]\\.[0-9]|20\\.[0-2]))))\\d*\\s*$',
   upper: '4005220.2',
   lower: '4004820.2',
   mid: '4004900.0',
   outUpper: '4005221.0',
   outLower: '4004819.9'
}, {
   name: "Large Num w/Decimal with percent",
   values: {
      ans: 409500.2,
      tol: '1%',
      dec: 1
   },
   regex: '^\\s*(?:4(?:0(?:5(?:4(?:0(?:5\\.[2-9]|[6-9]\\.[0-9])|[1-9][0-9]\\.[0-9])|[5-9][0-9][0-9]\\.[0-9])|[6-9][0-9][0-9][0-9]\\.[0-9])|1(?:[0-2][0-9][0-9][0-9]\\.[0-9]|3(?:[0-4][0-9][0-9]\\.[0-9]|5(?:[0-8][0-9]\\.[0-9]|9(?:[0-4]\\.[0-9]|5\\.[0-2]))))))\\d*\\s*$',
   upper: '413595.2',
   lower: '405405.2',
   mid: '409005.0',
   outUpper: '413595.4',
   outLower: '405405.0'
}, {
   name: "Large Num",
   values: {
      ans: 5209500,
      tol: 2000,
      dec: 0
   },
   regex: '^\\s*(?:52(?:0(?:7[5-9][0-9][0-9]|[89][0-9][0-9][0-9])|1(?:0[0-9][0-9][0-9]|1(?:[0-4][0-9][0-9]|500))))(?:\\.\\d*)?\\s*$',
   upper: '5211500',
   lower: '5207500',
   mid: '5209500',
   outUpper: '5211511',
   outLower: '5207499'
}, {
   name: "Large Num w/Decimal",
   values: {
      ans: 5209500,
      tol: '0.5%',
      dec: 0
   },
   regex: '^\\s*(?:5(?:1(?:8(?:3(?:4(?:5[3-9]|[6-9][0-9])|[5-9][0-9][0-9])|[4-9][0-9][0-9][0-9])|9[0-9][0-9][0-9][0-9])|2(?:[0-2][0-9][0-9][0-9][0-9]|3(?:[0-4][0-9][0-9][0-9]|5(?:[0-4][0-9][0-9]|5(?:[0-3][0-9]|4[0-8]))))))(?:\\.\\d*)?\\s*$',
   upper: '5235548',
   lower: '5183453',
   mid: '5200548',
   outUpper: '5235549',
   outLower: '5183452'
}];

testsTol.forEach(function (test) {
   runToleranceTest(test);
});

var testsBounds = [{
   name: "Large Range Number with bounds",
   values: {
      upper: 130.25,
      lower: 105.25,
      dec: 2
   },
   regex: '^\\s*(?:1(?:0(?:5\\.(?:2[5-9]|[3-9][0-9])|[6-9]\\.[0-9][0-9])|[12][0-9]\\.[0-9][0-9]|30\\.(?:[01][0-9]|2[0-5])))\\d*\\s*$',
   upper: '130.25',
   lower: '105.25',
   mid: '127.25',
   outUpper: '130.26',
   outLower: '105.20'
}, {
   name: "very small number with bounds",
   values: {
      upper: 0.0005921,
      lower: 0.0005357,
      dec: 7
   },
   regex: '^\\s*(?:0\\.0005(?:3(?:5[7-9]|[6-9][0-9])|[4-8][0-9][0-9]|9(?:[01][0-9]|2[01])))\\d*\\s*$',
   upper: '0.0005921',
   lower: '0.0005357',
   mid: '0.0005825',
   outUpper: '0.0005923',
   outLower: '0.0005351'
}, {
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
}, {
   name: "Large Num with decimal with bounds", // limitation is hundred thousand to one decimal place, really slow
   values: {
      upper: 404507.4,
      lower: 396497.1,
      dec: 1
   },
   regex: '^\\s*(?:39(?:6(?:49(?:7\\.[1-9]|[89]\\.[0-9])|[5-9][0-9][0-9]\\.[0-9])|[7-9][0-9][0-9][0-9]\\.[0-9])|40(?:[0-3][0-9][0-9][0-9]\\.[0-9]|4(?:[0-4][0-9][0-9]\\.[0-9]|50(?:[0-6]\\.[0-9]|7\\.[0-4]))))\\d*\\s*$',
   upper: '404507.4',
   lower: '396497.1',
   mid: '404500.5',
   outUpper: '404507.5',
   outLower: '396497.0'
}, {
   name: "Large Num with bounds",
   values: {
      upper: 5235548,
      lower: 5183453,
      dec: 0
   },
   regex: '^\\s*(?:5(?:1(?:8(?:3(?:4(?:5[3-9]|[6-9][0-9])|[5-9][0-9][0-9])|[4-9][0-9][0-9][0-9])|9[0-9][0-9][0-9][0-9])|2(?:[0-2][0-9][0-9][0-9][0-9]|3(?:[0-4][0-9][0-9][0-9]|5(?:[0-4][0-9][0-9]|5(?:[0-3][0-9]|4[0-8]))))))(?:\\.\\d*)?\\s*$',
   upper: '5235548',
   lower: '5183453',
   mid: '5205059',
   outUpper: '5235549',
   outLower: '5183452'
}];

testsBounds.forEach(function (test) {
   runBoundsTest(test);
});

//console.log(regEx);

//test numbers like 560 to 2 sigfigs js make it 5.6e2 check here http://jsfiddle.net/K5GRb/