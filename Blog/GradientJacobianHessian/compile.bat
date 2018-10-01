REM old one : browserify GradientJacobianHessianApp.js > GradientJacobianHessian.js
REM this solves this issue: https://stackoverflow.com/questions/45833846/js-browserify-function-not-defined
browserify GradientJacobianHessianApp.js --s app > GradientJacobianHessian.js