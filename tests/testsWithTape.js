/*jslint plusplus: true, node:true */
/*global */
"use strict";

var matchNumberRange = require('../matchNumberRangeRegex.js');

function makeEMessage(checkName) {
   return checkName + " check.";
}

function runTest(testOps, regExText) {
   var test = require('tape'),
      regEx = new RegExp(regExText),
      ops = {
         skip: testOps.skip === true
      };

   test(testOps.name, ops, function (t) {
      t.plan(6);

      t.equal(regExText, testOps.regex, "Generated regex is as expected");
      t.ok(regEx.test(testOps.upper), "Upper bound matches generated regex");
      t.ok(regEx.test(testOps.lower), "Lower bound matches generated regex");
      t.ok(regEx.test(testOps.mid), "Number mid boundaries matches generated regex");
      t.notOk(regEx.test(testOps.outUpper), "Number outside upper bound does not match generated regex");
      t.notOk(regEx.test(testOps.outLower), "Number outside lower bound does not match generated regex");

   });

}

function runToleranceTest(testIn) {
   runTest(testIn, matchNumberRange.fromTolerance(testIn.values.ans, testIn.values.tol, testIn.values.dec, testIn.values.needZero));
}

function runBoundsTest(testIn) {

   runTest(testIn, matchNumberRange.fromBounds(testIn.values.upper, testIn.values.lower, testIn.values.dec, testIn.values.needZero));
}

var testsTol = [{
   name: "Large Range Number",
   values: {
      ans: 130.25,
      tol: 45,
      dec: -2
   },
   regex: '^\\s*(?:8(?:5\\.(?:2[5-9]|[3-9]\\d)|[6-9]\\.\\d\\d)|9\\d\\.\\d\\d|1(?:[0-6]\\d\\.\\d\\d|7(?:[0-4]\\.\\d\\d|5\\.(?:[01]\\d|2[0-5]))))\\d*\\s*$',
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
      dec: -2
   },
   //                           4 ROUND
   regex: '^\\s*(?:7(?:1\\.(?:6[3-9]|[7-9]\\d)|[2-9]\\.\\d\\d)|[89]\\d\\.\\d\\d|1(?:[0-7]\\d\\.\\d\\d|8(?:[0-7]\\.\\d\\d|8\\.(?:[0-7]\\d|8[0-7]))))\\d*\\s*$',
   upper: '188.87',
   lower: '71.64',
   mid: '100.25',
   outUpper: '188.88',
   outLower: '71.60'
}, {
   name: "Small Number Optional Zero",
   values: {
      ans: 0.0005639,
      tol: 0.000005,
      dec: -7
   },
   regex: '^\\s*(?:0?\\.0005(?:5(?:89|9\\d)|6[0-8]\\d))\\d*\\s*$',
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
      dec: -7
   },
   regex: '^\\s*(?:0?\\.0005(?:3(?:5[7-9]|[6-9]\\d)|[4-8]\\d\\d|9(?:[01]\\d|2[01])))\\d*\\s*$',
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
      dec: -1
   },
   regex: '^\\s*(?:-1(?:[0-4]\\.\\d|5\\.0)|-[1-9]\\.\\d|-0?\\.\\d|0?\\.\\d|[1-9]\\.\\d|1(?:[0-4]\\.\\d|5\\.0))\\d*\\s*$',
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
   regex: '^\\s*(?:-10|-\\d|\\d|[12]\\d|30)(?:\\.\\d*)?\\s*$',
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
      dec: -1
   },
   regex: '^\\s*(?:400(?:4(?:8(?:2(?:0\\.[2-9]|[1-9]\\.\\d)|[3-9]\\d\\.\\d)|9\\d\\d\\.\\d)|5(?:[01]\\d\\d\\.\\d|2(?:[01]\\d\\.\\d|20\\.[0-2]))))\\d*\\s*$',
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
      dec: -1
   },
   regex:  '^\\s*(?:4(?:0(?:5(?:4(?:0(?:5\\.[1-9]|[6-9]\\.\\d)|[1-9]\\d\\.\\d)|[5-9]\\d\\d\\.\\d)|[6-9]\\d\\d\\d\\.\\d)|1(?:[0-2]\\d\\d\\d\\.\\d|3(?:[0-4]\\d\\d\\.\\d|5(?:[0-8]\\d\\.\\d|9(?:[0-4]\\.\\d|5\\.[0-3]))))))\\d*\\s*$',
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
   regex: '^\\s*(?:52(?:0(?:7[5-9]\\d\\d|[89]\\d\\d\\d)|1(?:0\\d\\d\\d|1(?:[0-4]\\d\\d|500))))(?:\\.\\d*)?\\s*$',
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
   regex: '^\\s*(?:5(?:1(?:8(?:3(?:4(?:5[2-9]|[6-9]\\d)|[5-9]\\d\\d)|[4-9]\\d\\d\\d)|9\\d\\d\\d\\d)|2(?:[0-2]\\d\\d\\d\\d|3(?:[0-4]\\d\\d\\d|5(?:[0-4]\\d\\d|5(?:[0-3]\\d|4[0-8]))))))(?:\\.\\d*)?\\s*$',
   upper: '5235548',
   lower: '5183452',
   mid: '5200548',
   outUpper: '5235549',
   outLower: '5183451'
}, {
   name: "Test bounds rounding to -0 w/ no decimal",
   values: {
      ans: -2,
      tol: '75%',
      dec: 0
   },
   regex: '^\\s*(?:-[0-4]|0)(?:\\.\\d*)?\\s*$',
   upper: '-0',
   lower: '-4',
   mid: '-2',
   outUpper: '1',
   outLower: '-5'
}, {
   name: "Test bounds rounding to -0 w/ decimal",
   values: {
      ans: -1,
      tol: '95%',
      dec: -1
   },
   regex: '^\\s*(?:-(?:1\\.\\d|2\\.0)|-0?\\.\\d|0?\\.0)\\d*\\s*$',
   upper: '0.0',
   lower: '-2.0',
   mid: '-1.0',
   outUpper: '0.1',
   outLower: '-2.1'
}];

testsTol.forEach(function (test) {
   runToleranceTest(test);
});
/****************BOUNDS TESTING******************/

/**************ADD positive dec test***********/
var testsBounds = [{
   name: "Large Range Number with bounds",
   values: {
      upper: 130.25,
      lower: 105.25,
      dec: -2
   },
   regex: '^\\s*(?:1(?:0(?:5\\.(?:2[5-9]|[3-9]\\d)|[6-9]\\.\\d\\d)|[12]\\d\\.\\d\\d|30\\.(?:[01]\\d|2[0-5])))\\d*\\s*$',
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
      dec: -7
   },
   regex: '^\\s*(?:0?\\.0005(?:3(?:5[7-9]|[6-9]\\d)|[4-8]\\d\\d|9(?:[01]\\d|2[01])))\\d*\\s*$',
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
      dec: -1
   },
   regex: '^\\s*(?:-1(?:[0-4]\\.\\d|5\\.0)|-[1-9]\\.\\d|-0?\\.\\d|0?\\.\\d|[1-9]\\.\\d|1(?:[0-4]\\.\\d|5\\.0))\\d*\\s*$',
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
      dec: -1
   },
   regex: '^\\s*(?:39(?:6(?:49(?:7\\.[1-9]|[89]\\.\\d)|[5-9]\\d\\d\\.\\d)|[7-9]\\d\\d\\d\\.\\d)|40(?:[0-3]\\d\\d\\d\\.\\d|4(?:[0-4]\\d\\d\\.\\d|50(?:[0-6]\\.\\d|7\\.[0-4]))))\\d*\\s*$',
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
   regex: '^\\s*(?:5(?:1(?:8(?:3(?:4(?:5[3-9]|[6-9]\\d)|[5-9]\\d\\d)|[4-9]\\d\\d\\d)|9\\d\\d\\d\\d)|2(?:[0-2]\\d\\d\\d\\d|3(?:[0-4]\\d\\d\\d|5(?:[0-4]\\d\\d|5(?:[0-3]\\d|4[0-8]))))))(?:\\.\\d*)?\\s*$',
   upper: '5235548',
   lower: '5183453',
   mid: '5205059',
   outUpper: '5235549',
   outLower: '5183452'
}, {
   name: "See large number with rounded bounds 4",
   values: {
      upper: 5235548,
      lower: 5183453,
      dec: 4
   },
   regex: '^\\s*(?:5(?:1[89]\\d\\d\\d\\d|2[0-4]\\d\\d\\d\\d))(?:\\.\\d*)?\\s*$',
   upper: '5235548',
   lower: '5183453',
   mid: '5205059',
   outUpper: '5250000',
   outLower: '5170000'
}, {
   name: "See large number with rounded bounds 6",
   values: {
      upper: 5235548,
      lower: 5183453,
      dec: 6
   },
   regex: '^\\s*(?:[56]\\d\\d\\d\\d\\d\\d)(?:\\.\\d*)?\\s*$',
   upper: '5235548',
   lower: '5183453',
   mid: '5205059',
   outUpper: '7000000',
   outLower: '4000000'
}];

testsBounds.forEach(function (test) {
   runBoundsTest(test);
});


//console.log(regEx);

//test numbers like 560 to 2 sigfigs js make it 5.6e2 check here http://jsfiddle.net/K5GRb/