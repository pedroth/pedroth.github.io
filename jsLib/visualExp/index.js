var VisualExp =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../Sort/main/Sort.js":
/*!****************************!*\
  !*** ../Sort/main/Sort.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const Sort = {};\r\n\r\nfunction swap(v, i, j) {\r\n  if (i >= 0 && i < v.length && j >= 0 && j < v.length) {\r\n    var temp = v[i];\r\n    v[i] = v[j];\r\n    v[j] = temp;\r\n  }\r\n}\r\n\r\n/**\r\n * array: array with objects\r\n * comparator: comparator function that compares elements of v. Comparator is a function f(a,b) -> integer\r\n */\r\nSort.quicksort = function(array, comparator = (a, b) => a - b > 0) {\r\n  const n = array.length;\r\n  const v = [...array];\r\n  const stack = [];\r\n  stack.push(0);\r\n  stack.push(n - 1);\r\n  while (stack.length > 0) {\r\n    const high = stack.pop();\r\n    const low = stack.pop();\r\n    /*\r\n     * partition\r\n     */\r\n    if (low < high) {\r\n      const pivot = low + Math.floor((high - low) * Math.random());\r\n      const pvalue = v[pivot];\r\n      swap(v, pivot, high);\r\n      let j = 0;\r\n      for (let i = 0; i < high; i++) {\r\n        if (comparator(v[i], pvalue) <= 0) {\r\n          swap(v, i, j);\r\n          j++;\r\n        }\r\n      }\r\n      swap(v, j, high);\r\n      stack.push(low);\r\n      stack.push(j - 1);\r\n      stack.push(j + 1);\r\n      stack.push(high);\r\n    }\r\n  }\r\n  return v;\r\n};\r\n\r\nmodule.exports = Sort;\r\n\n\n//# sourceURL=webpack://VisualExp/../Sort/main/Sort.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Sort = __webpack_require__(/*! ../Sort/main/Sort */ \"../Sort/main/Sort.js\");\r\nconst VisualExp = {};\r\n\r\nconst TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3;\r\n\r\nfunction date2int(date) {\r\n  var dateStrs = date.split(\"/\");\r\n  var acm = 0;\r\n  var ide = 1;\r\n  for (var j = 0; j < dateStrs.length; j++) {\r\n    acm += parseFloat(dateStrs[j]) * ide;\r\n    ide *= 100;\r\n  }\r\n  return acm;\r\n}\r\n\r\nVisualExp.retrieveAndAppend = async function(url, htmlId) {\r\n  console.log(`Reading from ${url}.. appending on ${htmlId}`);\r\n  const html = await fetch(url).then(x => x.text());\r\n  $(`#${htmlId}`).html(html); // it doesnt works with plain js\r\n};\r\n\r\nVisualExp.readDb = async function() {\r\n  const time = new Date().getTime();\r\n  if (!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS) {\r\n    const dbJson = await fetch(\"resources/db/db.json\").then(x => x.json());\r\n    localStorage.db = JSON.stringify({ time: time, data: dbJson });\r\n  }\r\n  return JSON.parse(localStorage.db).data;\r\n};\r\n\r\nVisualExp.sortDb = function(db) {\r\n  return Sort.quicksort(\r\n    db.experiments,\r\n    (a, b) => date2int(a.date) - date2int(b.date) > 0\r\n  );\r\n};\r\n\r\nVisualExp.createCardFromData = function(data) {};\r\n\r\nVisualExp.retrieveAndAppend(\r\n  \"resources/templates/nav/nav.html\",\r\n  \"indexContainer\"\r\n);\r\n\r\nmodule.exports.default = VisualExp;\r\n\n\n//# sourceURL=webpack://VisualExp/./main.js?");

/***/ })

/******/ })["default"];