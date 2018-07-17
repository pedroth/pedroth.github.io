REM old one : browserify TaylorPolynomialApp.js > TaylorPolynomial.js
REM this solves this issue: https://stackoverflow.com/questions/45833846/js-browserify-function-not-defined
browserify TaylorPolynomialApp.js --s app > TaylorPolynomial.js