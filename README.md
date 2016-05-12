# Match Number Range Regex Generator

The purpose of this web application is to generate Regular Expression codes for math questions that require a range of answers.

This application generates Regex codes based off of known bounds, a known answer with percent tolerance, and an answer with just a tolerance.

## Known Bounds

Upper - This is the highest number in the known number answer range.
Lower - This is the lowest number in the known number answer range.

## Bounds Calculated From Answer by Using Percent Tolerance
Answer - This is the median of the range of number answers.
Tolerance - This is a percentage value of how much the answer range will vary.

## Bounds Caculated From Answer by Using Tolerance
Answer - This is the median of the range of number answers.
Tolerance - Unlike the previous section, this tolerance is not a percentage value.  This tolerance will be added and subtracted to the answer given for the answer range.

## Option on all Sections
Round to - This is the number position of which the number will round to.

### Note on Application Functionality
The application will only function if the round to option is as big as the bounds or answer given.

http://byuicampuscd.github.io/match-number-range/

## Additional Features
There is a testing suite that utilizes tapejs to make sure that the application is generating the Regex expressions correctly.