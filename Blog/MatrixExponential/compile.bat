REM old one : browserify ODEMatrixExponentialApp.js > ODEMatrixExponential.js
REM this solves this issue: https://stackoverflow.com/questions/45833846/js-browserify-function-not-defined
browserify MatrixExponentialApp.js --s app > MatrixExponential.js