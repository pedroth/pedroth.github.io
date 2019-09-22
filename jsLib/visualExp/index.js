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

/***/ "../ArrayUtils/main/ArrayUtils.js":
/*!****************************************!*\
  !*** ../ArrayUtils/main/ArrayUtils.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var ArrayUtils = {};\r\n\r\n/**\r\n * Union of array a1 and a2\r\n * @param {*} a1\r\n * @param {*} a2\r\n */\r\nArrayUtils.concat = function(a1, a2) {\r\n  return a1.concat(a2);\r\n};\r\n\r\n/**\r\n *  Test if linear arrays are equal\r\n * @param {*} a1\r\n * @param {*} a2\r\n */\r\nArrayUtils.arrayEquals = function(a1, a2) {\r\n  if (a1.length != a2.length) return false;\r\n  for (var i = 0; i < a1.length; i++) {\r\n    if (a1[i] != a2[i]) return false;\r\n  }\r\n  return true;\r\n};\r\n\r\n/**\r\n * Return a new array permutation\r\n * @param {*} array\r\n * @param {*} permutation is an array with length <= array.length that has the new indexes\r\n */\r\nArrayUtils.permute = function(array, permutation) {\r\n  if (permutation.length > array.length) {\r\n    throw `permutation array length > array length[${array.length}]`;\r\n  }\r\n  var copy = array.slice();\r\n  for (var i = 0; i < permutation.length; i++) {\r\n    copy[permutation[i]] = array[i];\r\n  }\r\n  return copy;\r\n};\r\n\r\n/**\r\n * Fisher-Yates shuffle algorithm\r\n */\r\nArrayUtils.randomPermute = function(array) {\r\n  const ans = [...array];\r\n  for (let i = array.length - 1; i > 0; i--) {\r\n    // random number between 0 and i\r\n    const r = Math.floor(Math.random() * (i + 1));\r\n    //swap in place\r\n    const temp = ans[i];\r\n    ans[i] = ans[r];\r\n    ans[r] = temp;\r\n  }\r\n  return ans;\r\n};\r\n\r\n/**\r\n * return swap array indexes\r\n */\r\nArrayUtils.swap = function(array, i, j) {\r\n  var t = array[i];\r\n  array[i] = array[j];\r\n  array[j] = t;\r\n  return array;\r\n};\r\n\r\nArrayUtils.findJsArrayDim = function(array) {\r\n  if (array instanceof Array) {\r\n    return ArrayUtils.concat(ArrayUtils.findJsArrayDim(array[0]), [\r\n      array.length\r\n    ]);\r\n  } else {\r\n    return [];\r\n  }\r\n};\r\n\r\nArrayUtils.unpackJsArray = function(array) {\r\n  if (array instanceof Array) {\r\n    var joinIdentity = [];\r\n    for (var i = 0; i < array.length; i++) {\r\n      joinIdentity = ArrayUtils.concat(\r\n        joinIdentity,\r\n        ArrayUtils.unpackJsArray(array[i])\r\n      );\r\n    }\r\n    return joinIdentity;\r\n  } else {\r\n    return [array];\r\n  }\r\n};\r\n\r\nArrayUtils.range = function(xmin, xmax, step = 1) {\r\n  var ans = [];\r\n  for (var i = xmin; i < xmax; i += step) ans.push(i);\r\n  return ans;\r\n};\r\n\r\nArrayUtils.binaryOp = function(array1, array2, binaryOp) {\r\n  var smaller = array1.length < array2.length ? array1.slice() : array2.slice();\r\n  for (let i = 0; i < smaller.length; i++)\r\n    smaller[i] = binaryOp(array1[i], array2[i]);\r\n  return smaller;\r\n};\r\n\r\nmodule.exports = ArrayUtils;\r\n\n\n//# sourceURL=webpack://VisualExp/../ArrayUtils/main/ArrayUtils.js?");

/***/ }),

/***/ "../Sort/main/Sort.js":
/*!****************************!*\
  !*** ../Sort/main/Sort.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const Sort = {};\r\n\r\nfunction swap(v, i, j) {\r\n  if (i >= 0 && i < v.length && j >= 0 && j < v.length) {\r\n    var temp = v[i];\r\n    v[i] = v[j];\r\n    v[j] = temp;\r\n  }\r\n}\r\n\r\n/**\r\n * array: array with objects\r\n * comparator: comparator function that compares elements of v. Comparator is a function f(a,b) -> z in integers, where z < 0\r\n */\r\nSort.quicksort = function(array, comparator = (a, b) => a - b) {\r\n  const n = array.length;\r\n  const v = [...array];\r\n  const stack = [];\r\n  stack.push(0);\r\n  stack.push(n - 1);\r\n  while (stack.length > 0) {\r\n    const high = stack.pop();\r\n    const low = stack.pop();\r\n    /*\r\n     * partition\r\n     */\r\n    if (low < high) {\r\n      const pivot = low + Math.floor((high - low) * Math.random());\r\n      const pvalue = v[pivot];\r\n      swap(v, pivot, high);\r\n      let j = low;\r\n      for (let i = low; i < high; i++) {\r\n        if (comparator(v[i], pvalue) <= 0) {\r\n          swap(v, i, j);\r\n          j++;\r\n        }\r\n      }\r\n      swap(v, j, high);\r\n      stack.push(low);\r\n      stack.push(j - 1);\r\n      stack.push(j + 1);\r\n      stack.push(high);\r\n    }\r\n  }\r\n  return v;\r\n};\r\n\r\nSort.REVERSE_SORT_COMPARATOR = (a, b) => b - a;\r\n\r\nmodule.exports = Sort;\r\n\n\n//# sourceURL=webpack://VisualExp/../Sort/main/Sort.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Sort = __webpack_require__(/*! ../Sort/main/Sort */ \"../Sort/main/Sort.js\");\r\nconst ArrayUtils = __webpack_require__(/*! ../ArrayUtils/main/ArrayUtils */ \"../ArrayUtils/main/ArrayUtils.js\");\r\nconst TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;\r\n\r\nfunction date2int(date) {\r\n  var dateStrs = date.split(\"/\");\r\n  var acm = 0;\r\n  var ide = 1;\r\n  for (var j = 0; j < dateStrs.length; j++) {\r\n    acm += parseFloat(dateStrs[j]) * ide;\r\n    ide *= 100;\r\n  }\r\n  return acm;\r\n}\r\n\r\n//Returns true if it is a DOM element\r\nfunction isElement(o) {\r\n  return typeof HTMLElement === \"object\"\r\n    ? o instanceof HTMLElement //DOM2\r\n    : o &&\r\n        typeof o === \"object\" &&\r\n        o !== null &&\r\n        o.nodeType === 1 &&\r\n        typeof o.nodeName === \"string\";\r\n}\r\n\r\nfunction createTagElement(tags) {\r\n  return tags.map(tag =>\r\n    ElementBuilder.of(\"a\")\r\n      .attribute(\"class\", \"badge badge-light\")\r\n      .attribute(\"href\", `/?q=${tag}`)\r\n      .innerHtml(tag)\r\n      .build()\r\n  );\r\n}\r\n\r\nclass ElementBuilder {\r\n  constructor(element) {\r\n    this.element = element;\r\n  }\r\n\r\n  attribute(name, value) {\r\n    this.element.setAttribute(name, value);\r\n    return this;\r\n  }\r\n\r\n  append(element) {\r\n    if (element instanceof Array) {\r\n      element.forEach(x => this.element.appendChild(x));\r\n    } else {\r\n      this.element.appendChild(element);\r\n    }\r\n    return this;\r\n  }\r\n\r\n  innerHtml(value) {\r\n    console.log(\"Inner HTML\", value, this);\r\n    this.element.innerHTML = value;\r\n    return this;\r\n  }\r\n\r\n  build() {\r\n    return this.element;\r\n  }\r\n\r\n  /**\r\n   * @param {*} elem: string || element\r\n   */\r\n  static of(elem) {\r\n    if (isElement(elem)) {\r\n      return new ElementBuilder(elem);\r\n    }\r\n    return new ElementBuilder(document.createElement(elem));\r\n  }\r\n}\r\n\r\nconst VisualExp = {};\r\n\r\nVisualExp.ElementBuilder = ElementBuilder;\r\n\r\nVisualExp.retrieveAndAppend = async function(url, htmlId) {\r\n  console.log(`Reading from ${url}.. appending on ${htmlId}`);\r\n  const html = await fetch(url).then(x => x.text());\r\n  $(`#${htmlId}`).html(html); // it doesnt works with plain js\r\n};\r\n\r\nVisualExp.readDb = async function() {\r\n  const time = new Date().getTime();\r\n  if (!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS) {\r\n    const dbJson = await fetch(\"resources/db/db.json\").then(x => x.json());\r\n    localStorage.db = JSON.stringify({ time: time, data: dbJson });\r\n  }\r\n  return JSON.parse(localStorage.db).data;\r\n};\r\n\r\nVisualExp.sortDb = function(db) {\r\n  return Sort.quicksort(\r\n    db.experiments,\r\n    (a, b) => date2int(a.date) - date2int(b.date) < 0\r\n  );\r\n};\r\n\r\nVisualExp.randomDb = function(db) {\r\n  return ArrayUtils.randomPermute(db.experiments);\r\n};\r\n\r\n/**\r\n * @param data: {imageSrc: string, url: string, title: string, tags: array<string>, date: string}\r\n */\r\nVisualExp.createCardFromData = function(data) {\r\n  console.log(\"Create Card From Data\", data);\r\n  const card = VisualExp.ElementBuilder.of(\"div\")\r\n    .attribute(\"class\", \"card simplePaper\")\r\n    .append(\r\n      VisualExp.ElementBuilder.of(\"a\")\r\n        .attribute(\"href\", data.url)\r\n        .append(\r\n          VisualExp.ElementBuilder.of(\"img\")\r\n            .attribute(\"class\", \"card-img-top card-plugin\")\r\n            .attribute(\"src\", data.imageSrc)\r\n            .attribute(\"href\", data.url)\r\n            .attribute(\"alt\", data.title)\r\n            .build()\r\n        )\r\n        .build()\r\n    )\r\n    .append(\r\n      VisualExp.ElementBuilder.of(\"div\")\r\n        .attribute(\"class\", \"card-body\")\r\n        .append(\r\n          VisualExp.ElementBuilder.of(\"a\")\r\n            .attribute(\"href\", data.url)\r\n            .append(\r\n              VisualExp.ElementBuilder.of(\"h3\")\r\n                .attribute(\"class\", \"card-title title\")\r\n                .innerHtml(data.title)\r\n                .build()\r\n            )\r\n            .build()\r\n        )\r\n        .append(\r\n          VisualExp.ElementBuilder.of(\"div\")\r\n            .append(createTagElement(data.tags))\r\n            .build()\r\n        )\r\n        .append(\r\n          VisualExp.ElementBuilder.of(\"p\")\r\n            .attribute(\"class\", \"border-top\")\r\n            .innerHtml(data.date)\r\n            .build()\r\n        )\r\n        .build()\r\n    )\r\n    .build();\r\n  return card;\r\n};\r\n\r\nVisualExp.retrieveAndAppend(\r\n  \"resources/templates/nav/nav.html\",\r\n  \"indexContainer\"\r\n);\r\n\r\nmodule.exports.default = VisualExp;\r\n\n\n//# sourceURL=webpack://VisualExp/./main.js?");

/***/ })

/******/ })["default"];