(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Pedroth"] = factory();
	else
		root["Pedroth"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Pedroth/Pedroth.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _arrayLikeToArray; });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _arrayWithHoles; });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _asyncToGenerator; });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _classCallCheck; });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _createClass; });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _defineProperty; });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _iterableToArrayLimit; });
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _nonIterableRest; });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _slicedToArray; });
/* harmony import */ var _arrayWithHoles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return Object(_arrayWithHoles__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || Object(_iterableToArrayLimit__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || Object(_unsupportedIterableToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || Object(_nonIterableRest__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _typeof; });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _unsupportedIterableToArray; });
/* harmony import */ var _arrayLikeToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return Object(_arrayLikeToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Object(_arrayLikeToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/Card/Card.css":
/*!*****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/Card/Card.css ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".card {\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: border-box;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n  border-radius: 0.25rem;\n}\n\n.card-body {\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n  padding: 1.25rem;\n}\n\n.badge {\n  display: inline-block;\n  padding: 0.25em 0.4em;\n  font-size: 75%;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,\n    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n\n.badge-light {\n  color: #212529;\n  background-color: #f8f9fa;\n}\n\n.card-img-top {\n  width: 100%;\n  border-top-left-radius: calc(0.25rem - 1px);\n  border-top-right-radius: calc(0.25rem - 1px);\n}\n\n.card-plugin {\n  height: 37vh;\n  max-height: 400px;\n}\n\n.card-title {\n  margin-bottom: 0.75rem;\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/SearchInput/SearchInput.css":
/*!*******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/SearchInput/SearchInput.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, ".search-list {\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n}\n\n.search-list-item {\n  position: relative;\n  display: block;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "./node_modules/nabla.js/dist/index.js":
/*!*********************************************!*\
  !*** ./node_modules/nabla.js/dist/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():undefined}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e),r.d(e,"Canvas",(function(){return m})),r.d(e,"Canvas2D",(function(){return w})),r.d(e,"ImageIO",(function(){return a})),r.d(e,"Stream",(function(){return I})),r.d(e,"ArrayUtils",(function(){return M})),r.d(e,"Sort",(function(){return A})),r.d(e,"EditDistance",(function(){return E}));const n={getImageCanvas:t=>{const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const r=e.getContext("2d");return r.fillStyle="rgba(0, 0, 0, 0)",r.globalCompositeOperation="source-over",r.fillRect(0,0,e.width,e.height),r.drawImage(t,0,0),e},getDataFromImage:t=>(canvas=n.getImageCanvas(t),canvas.getContext("2d").getImageData(0,0,t.width,t.height)),loadImage:t=>{const e=new Image;return e.src=t,e.isReady=!1,e.onload=()=>e.isReady=!0,e},generateImageReadyPredicate:t=>()=>t.isReady};var a=n;function i(t,e){var r=[];return r[0]=t[0]+e[0],r[1]=t[1]+e[1],r}function o(t){var e=[];return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e}function s(t,e){var r=[];return r[0]=t[0]-e[0],r[1]=t[1]-e[1],r}function h(t,e){return t[0]*e[0]+t[1]*e[1]}function c(t){return h(t,t)}function u(t){return Math.sqrt(h(t,t))}function f(t,e){var r=[];return r[0]=Math.min(t[0],e[0]),r[1]=Math.min(t[1],e[1]),r}function l(t,e){var r=[];return r[0]=Math.max(t[0],e[0]),r[1]=Math.max(t[1],e[1]),r}function p(t,e,r){var n=r[1]/t[1];return[n,(-t[0]*n+r[0])/e]}function g(t,e,r){var n=r[0]/t[0];return[n,(-t[1]*n+r[1])/e]}var d=function(t){this.canvas=t,this.ctx=t.getContext("2d"),this.image=this.ctx.getImageData(0,0,t.width,t.height),this.imageData=this.image.data};d.prototype.getSize=function(){return[this.canvas.height,this.canvas.width]},d.prototype.paintImage=function(){this.ctx.putImageData(this.image,0,0)},d.prototype.getCanvas=function(){return this.canvas},d.prototype.clearImage=function(t){this.useCanvasCtx(e=>{var r=e.getSize();e.ctx.fillStyle="rgba("+t[0]+","+t[1]+","+t[2]+","+t[3]+")",e.ctx.globalCompositeOperation="source-over",e.ctx.fillRect(0,0,r[1],r[0])},!0)},d.prototype.useCanvasCtx=function(t,e=!1){e||this.ctx.putImageData(this.image,0,0),t(this),this.image=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height),this.imageData=this.image.data},d.prototype.getImageIndex=function(t){return 4*(this.canvas.width*t[0]+t[1])},d.prototype.getPxl=function(t){var e=this.getImageIndex(t);return[this.imageData[e],this.imageData[e+1],this.imageData[e+2],this.imageData[e+3]]},d.prototype.drawPxl=function(t,e){var r=this.getImageIndex(t);this.imageData[r]=e[0],this.imageData[r+1]=e[1],this.imageData[r+2]=e[2],this.imageData[r+3]=e[3]},d.prototype.drawLine=function(t,e,r){r.points=[t,e];var n=[];n.push(t),n.push(e);for(var a=[],i=[],o=0;o<n.length;o++){0<=(l=n[o])[0]&&l[0]<this.canvas.height&&0<=l[1]&&l[1]<this.canvas.width?a.push(l):i.push(l)}if(2!=a.length){var c=[],u=[e[0]-t[0],e[1]-t[1]];c.push(p(u,-(this.canvas.height-1),[-t[0],-t[1]])),c.push(g(u,-(this.canvas.width-1),[this.canvas.height-1-t[0],-t[1]])),c.push(p(u,this.canvas.height-1,[this.canvas.height-1-t[0],this.canvas.width-1-t[1]])),c.push(g(u,this.canvas.width-1,[-t[0],this.canvas.width-1-t[1]]));var f=[];for(o=0;o<c.length;o++){var l;0<=(l=c[o])[0]&&l[0]<=1&&0<=l[1]&&l[1]<=1&&f.push(l)}if(0!=f.length)if(a.length>0){var d=[t[0]+f[0][0]*u[0],t[1]+f[0][0]*u[1]];this.drawLineInt(a.pop(),d,r)}else{var m=[t[0]+f[0][0]*u[0],t[1]+f[0][0]*u[1]];for(o=1;o<f.length;o++){if(h(u=s(d=[t[0]+f[o][0]*u[0],t[1]+f[o][0]*u[1]],m),u)>.001)return void this.drawLineInt(m,d,r)}this.drawLineInt(m,m,r)}}else this.drawLineInt(a[0],a[1],r)},d.prototype.drawLineInt=function(t,e,r){t=o(t),e=o(e);var n=[-1,0,1],a=n.length,c=a*a,u=[];u[0]=t[0],u[1]=t[1];var f=s(e,t),l=[];for(l[0]=-f[1],l[1]=f[0],r(u,r.points,this);u[0]!==e[0]||u[1]!==e[1];){for(var p=Number.MAX_VALUE,g=[],d=0;d<c;d++){var m=n[d%a],y=n[Math.floor(d/a)],v=s(i(u,[m,y]),t),w=Math.abs(h(v,l))-h(v,f);p>w&&(p=w,g=[m,y])}r(u=i(u,g),r.points,this)}r(u,r.points,this)},d.prototype.drawPolygon=function(t,e,r=d.isInsidePolygon){let n=[[Number.MAX_VALUE,Number.MAX_VALUE],[Number.MIN_VALUE,Number.MIN_VALUE]];for(let e=0;e<t.length;e++)n[0]=f(t[e],n[0]),n[1]=l(t[e],n[1]);let a=s(this.getSize(),[1,1]),i=[0,0];n[0]=o(f(a,l(i,n[0]))),n[1]=o(f(a,l(i,n[1])));for(var h=n[0][0];h<n[1][0];h++)for(var c=n[0][1];c<n[1][1];c++){var u=[h,c];r(u,t)&&e(u,t,this)}},d.prototype.drawTriangle=function(t,e,r,n){var a=[t,e,r];this.drawPolygon(a,n,d.isInsideConvex)},d.prototype.drawQuad=function(t,e,r,n,a){this.drawPolygon([t,e,r,n],a)},d.prototype.drawImage=function(t,e){"isReady"in t&&!t.isReady||this.useCanvasCtx(r=>r.ctx.drawImage(t,e[1],e[0]))},d.prototype.drawCircle=function(t,e,r){var n=function(t,e){var r=[];return r[0]=t[0]*e,r[1]=t[1]*e,r}([1,1],e),a=[s(t,n),i(t,n)],h=this.getSize();a[0]=o(f(s(h,[1,1]),l([0,0],a[0]))),a[1]=o(f(s(h,[1,1]),l([0,0],a[1])));for(var c=a[0][0];c<=a[1][0];c++)for(var u=a[0][1];u<=a[1][1];u++){var p=[c,u];this.isInsideCircle(p,t,e)&&r(p,[t,e],this)}},d.prototype.isInsideCircle=function(t,e,r){return c(s(t,e))<=r*r},d.prototype.addEventListener=function(t,e,r){this.canvas.addEventListener(t,e,r)},d.prototype.drawString=function(t,e,r){this.useCanvasCtx(n=>{r(n.ctx),n.ctx.fillText(e,t[1],t[0])})},d.isInsidePolygon=function(t,e){for(var r=[],n=0,a=e.length,i=0;i<a;i++)r[0]=s(e[(i+1)%a],t),r[1]=s(e[i],t),n+=Math.acos(h(r[0],r[1])/(u(r[0])*u(r[1])));return Math.abs(n-2*Math.PI)<.001},d.isInsideConvex=function(t,e){for(var r=e.length,n=[],a=[],i=0;i<r;i++){n[i]=s(e[(i+1)%r],e[i]);let o=[-n[i][1],n[i][0]],c=s(t,e[i]);a[i]=h(c,o)}let o=n[0][0]*n[1][1]-n[0][1]*n[1][0]>0?1:-1;for(i=0;i<r;i++){if(a[i]*o<0)return!1}return!0},d.simpleShader=function(t){return(e,r,n)=>n.drawPxl(e,t)},d.colorShader=function(t){return d.interpolateTriangleShader((e,r,n,a)=>{for(var i=[0,0,0,0],o=0;o<r.length;o++)i[0]=i[0]+t[o][0]*a[o],i[1]=i[1]+t[o][1]*a[o],i[2]=i[2]+t[o][2]*a[o],i[3]=i[3]+t[o][3]*a[o];n.drawPxl(e,i)})},d.interpolateQuadShader=function(t){return function(e,r,n){var a=[r[0],r[1],r[2]],i=[r[2],r[3],r[0]],o=d.triangleBaryCoord(e,a);o[0]>0&&o[1]>0&&o[2]>0&&Math.abs(o[0]+o[1]+o[2]-1)<1e-10?t(e,r,n,[o[0],o[1],o[2],0]):(o=d.triangleBaryCoord(e,i),t(e,r,n,[o[2],0,o[0],o[1]]))}},d.interpolateTriangleShader=function(t){return(e,r,n)=>{alpha=d.triangleBaryCoord(e,r),t(e,r,n,alpha)}},d.interpolateLineShader=function(t){return(e,r,n)=>{var a=s(r[1],r[0]),i=s(e,r[0]),o=c(a),u=h(i,a);t(e,r,n,0==o?0:u/o)}},d.quadTextureShader=function(t,e,r=d.bilinearInterpolation){let n=null;return d.interpolateQuadShader((h,c,u,p)=>{t.isReady&&null!=n||(n=new d(a.getImageCanvas(t)));const g=n,m=g.getSize(),y=[0,0];for(let t=0;t<e.length;t++)y[0]=y[0]+e[t][0]*p[t],y[1]=y[1]+e[t][1]*p[t];var v=[(1-y[1])*(m[1]-1),(m[0]-1)*y[0]],w=o(v=l([0,0],f(s([m[0],m[1]],[1,1]),v))),x=[g.getPxl(w),g.getPxl(i(w,[1,0])),g.getPxl(i(w,[1,1])),g.getPxl(i(w,[0,1]))],S=r(x,s(v,w));u.drawPxl(h,S)})},d.triangleCache=(()=>{const t=[];return{constains:e=>null!=t[e%3],get:e=>t[e%3],set:(e,r)=>t[e%3]=r}})(),d.triangleHash=t=>[t[0][0],t[1][0],t[2][0],t[0][1],t[1][1],t[2][1]].reduce((t,e)=>31*t+e,1),d.triangleBaryCoord=function(t,e){const r=d.triangleHash(e),n=[t[0]-e[0][0],t[1]-e[0][1]];if(!d.triangleCache.constains(r)){const t=[e[1][0]-e[0][0],e[1][1]-e[0][1]],n=[e[2][0]-e[0][0],e[2][1]-e[0][1]],a=t[0]*n[1]-t[1]*n[0];d.triangleCache.set(r,{triangle:e,u:t.map(t=>t/a),v:n.map(t=>t/a),det:a,hash:r})}const a=d.triangleCache.get(r),i=a.u,o=a.v;if(0==a.det)return[0,0,0];var s=[o[1]*n[0]-o[0]*n[1],i[0]*n[1]-i[1]*n[0]];return[1-s[0]-s[1],s[0],s[1]]},d.bilinearInterpolation=function(t,e){for(var r=[],n=0;n<t.length;n++){var a=t[0][n]+(t[3][n]-t[0][n])*e[1],i=a+(t[1][n]+(t[2][n]-t[1][n])*e[1]-a)*e[0];r.push(i)}return r},d.createCanvas=function(t,e){const r=document.createElement("canvas");return r.setAttribute("width",t[0]),r.setAttribute("height",t[1]),document.getElementById(e).appendChild(r),r};var m=d,v=function(t,e){if(m.call(this,t),2!=e.length||2!=e[0].length&&2!=e[1].length)throw"camera space must be 2-dim array with 2-dim arrays representing an interval";this.cameraSpace=e};(v.prototype=Object.create(m.prototype)).constructor=v,v.prototype.integerTransform=function(t){return[-(this.canvas.height-1)/(this.cameraSpace[1][1]-this.cameraSpace[1][0])*(t[1]-this.cameraSpace[1][1]),(this.canvas.width-1)/(this.cameraSpace[0][1]-this.cameraSpace[0][0])*(t[0]-this.cameraSpace[0][0])]},v.prototype.inverseTransform=function(t){return[this.cameraSpace[0][0]+(this.cameraSpace[0][1]-this.cameraSpace[0][0])/(this.canvas.width-1)*t[1],this.cameraSpace[1][1]-(this.cameraSpace[1][1]-this.cameraSpace[1][0])/(this.canvas.height-1)*t[0]]},v.prototype.drawLine=function(t,e,r){y1=this.integerTransform(t),y2=this.integerTransform(e),m.prototype.drawLine.call(this,y1,y2,r)},v.prototype.drawTriangle=function(t,e,r,n){y1=this.integerTransform(t),y2=this.integerTransform(e),y3=this.integerTransform(r),m.prototype.drawTriangle.call(this,y1,y2,y3,n)},v.prototype.drawQuad=function(t,e,r,n,a){y1=this.integerTransform(t),y2=this.integerTransform(e),y3=this.integerTransform(r),y4=this.integerTransform(n),m.prototype.drawQuad.call(this,y1,y2,y3,y4,a)},v.prototype.drawCircle=function(t,e,r){y=this.integerTransform(t),z=this.integerTransform([e,0])[1]-this.integerTransform([0,0])[1],m.prototype.drawCircle.call(this,y,z,r)},v.prototype.drawImage=function(t,e){m.prototype.drawImage.call(this,t,this.integerTransform(e))},v.prototype.drawString=function(t,e,r){y=this.integerTransform(t),m.prototype.drawString.call(this,y,e,r)},v.prototype.setCamera=function(t){if(2!=t.length||2!=t[0].length&&2!=t[1].length)throw"camera space must be 2-dim array with 2-dim arrays representing an interval";this.cameraSpace=t};var w=v;const x=function(t){this.f=t};x.prototype.compose=function(t){return new x(e=>this.f(t(e)))},x.prototype.leftCompose=function(t){return new x(e=>t(this.f(e)))},x.prototype.apply=function(t){return this.f(t)},x.prototype.get=function(){return this.f},x.of=function(t){return new x(t)};var S=x,b=function(t,e=(t=>t),r=(t=>!0)){this.gen=t,this.mapFunction=e,this.filterPredicate=r};b.prototype.state=function(){return this.gen.state},b.prototype.hasNext=function(){return this.gen.hasNext(this.filteredState())},b.prototype.filteredState=function(){for(var t=this.state();this.gen.hasNext(t)&&!this.filterPredicate(this.gen.peek(t));)t=this.gen.next(t);return t},b.prototype.head=function(){let t=this.filteredState();if(this.gen.hasNext(t))return this.gen.peek(t);throw"No head element exception"},b.prototype.tail=function(){return new b(b.generatorOf(this.gen.next(this.filteredState()),this.gen.next,this.gen.peek,this.gen.hasNext),this.mapFunction,this.filterPredicate)},b.prototype.map=function(t){return new b(this.gen,S.of(t).compose(this.mapFunction).get(),this.filterPredicate)},b.prototype.reduce=function(t,e){for(var r=this;r.hasNext();){let n=r.head();t=e(t,r.mapFunction(n)),r=r.tail()}return t},b.prototype.forEach=function(t){for(var e=this;e.hasNext();){let r=e.head();t(e.mapFunction(r)),e=e.tail()}},b.prototype.collect=function(t){return this.reduce(t.identity,t.reduce)},b.prototype.filter=function(t){return new b(this.gen,this.mapFunction,e=>this.filterPredicate(e)&&t(e))},b.prototype.take=function(t){return new b(b.generatorOf({i:0,stream:this},t=>({i:t.i+1,stream:t.stream.tail()}),t=>t.stream.head(),e=>e.stream.hasNext()&&e.i<t),this.mapFunction,this.filterPredicate).collect(b.Collectors.toArray())},b.prototype.takeWhile=function(t){return new b(b.generatorOf(this,t=>t.tail(),t=>t.head(),e=>e.hasNext()&&t(e.head())),this.mapFunction,this.filterPredicate).collect(b.Collectors.toArray())},b.prototype.zip=function(t){return new b(b.generatorOf([this,t],t=>[t[0].tail(),t[1].tail()],t=>[t[0].head(),t[1].head()],t=>t[0].hasNext()&&t[1].hasNext()))},b.prototype.flatMap=function(t){return new b(b.generatorOf({baseStream:this,flatStream:null},e=>{if(!e.flatStream||!e.flatStream.hasNext()){let r=e.baseStream;return{baseStream:r.tail(),flatStream:t(r.head()).tail()}}return{baseStream:e.baseStream,flatStream:e.flatStream.tail()}},e=>e.flatStream&&e.flatStream.hasNext()?e.flatStream.head():t(e.baseStream.head()).head(),e=>e.flatStream?e.baseStream.hasNext()||e.flatStream.hasNext():e.baseStream.hasNext()&&t(e.baseStream.head()).hasNext()))},b.ofHeadTail=function(t,e){return new b(b.generatorOf({h:t,supplier:e},t=>{let e=t.supplier();return e.hasNext()?{h:e.head(),supplier:()=>e.tail()}:{h:null,supplier:null}},t=>t.h,t=>null!=t.h))},b.of=function(t){var e=[{name:"Array",predicate:t=>t.constructor===Array},{name:"Generator",predicate:t=>"function"==typeof t.hasNext&&"function"==typeof t.next&&"function"==typeof t.peek},{name:"Stream",predicate:t=>t.__proto__==b.prototype}],r={Array:t=>new b(b.generatorOf({i:0,array:t},t=>({i:t.i+1,array:t.array}),t=>t.array[t.i],t=>t.i<t.array.length)),Generator:t=>new b(t),Stream:t=>new b(t.gen,t.mapFunction,t.filterPredicate)};for(let n=0;n<e.length;n++)if(e[n].predicate(t))return r[e[n].name](t);throw`Iterable ${t} does not have a stream`},b.range=function(t,e,r=1){return new b(b.generatorOf(t,t=>t+r,t=>t,t=>null==e||t<e))},b.generatorOf=function(t,e,r,n){return new function(){this.state=t,this.next=e,this.peek=r,this.hasNext=n}},b.Collectors={toArray:()=>new function(){this.identity=[],this.reduce=(t,e)=>(t.push(e),t)}};var I=b,C={concat:function(t,e){return t.concat(e)},arrayEquals:function(t,e){if(t.length!=e.length)return!1;for(var r=0;r<t.length;r++)if(t[r]!=e[r])return!1;return!0},permute:function(t,e){for(var r=t.slice(),n=Math.min(t.length,e.length),a=0;a<n;a++)r[e[a]]=t[a];return r},randomPermute:function(t){const e=[...t];for(let r=t.length-1;r>0;r--){const t=Math.floor(Math.random()*(r+1)),n=e[r];e[r]=e[t],e[t]=n}return e},swap:function(t,e,r){var n=t[e];return t[e]=t[r],t[r]=n,t},findJsArrayDim:function(t){return t instanceof Array?C.concat(C.findJsArrayDim(t[0]),[t.length]):[]},unpackJsArray:function(t){if(t instanceof Array){for(var e=[],r=0;r<t.length;r++)e=C.concat(e,C.unpackJsArray(t[r]));return e}return[t]},range:function(t,e,r=1){for(var n=[],a=t;a<e;a+=r)n.push(a);return n},binaryOp:function(t,e,r){var n=t.length<e.length?t.slice():e.slice();for(let a=0;a<n.length;a++)n[a]=r(t[a],e[a]);return n},map:function(t,e){const r=[];for(let n=0;n<t.length;n++)r.push(e(t[n],n));return r},filter:function(t,e){const r=[];for(let n=0;n<t.length;n++)e(t[n],n)&&r.push(t[n]);return r},forEach:function(t,e){for(let r=0;r<t.length;r++)e(t[r],r)}},M=C;const N={};function P(t,e,r){if(e>=0&&e<t.length&&r>=0&&r<t.length){var n=t[e];t[e]=t[r],t[r]=n}}N.quicksort=function(t,e=((t,e)=>t-e)){const r=t.length,n=[...t],a=[];for(a.push(0),a.push(r-1);a.length>0;){const t=a.pop(),r=a.pop();if(r<t){const i=r+Math.floor((t-r)*Math.random()),o=n[i];P(n,i,t);let s=r;for(let a=r;a<t;a++)e(n[a],o)<=0&&(P(n,a,s),s++);P(n,s,t),a.push(r),a.push(s-1),a.push(s+1),a.push(t)}}return n},N.REVERSE_SORT_COMPARATOR=(t,e)=>e-t;var A=N;const T={distanceFactory:(t=1,e=1,r=1)=>(n,a,i=(t=>{}))=>{const o=n.length,s=a.length,h=O(o+1,s+1);for(let t=0;t<o+1;t++)h[t][0]=t*e;for(let t=0;t<s+1;t++)h[0][t]=t*r;for(let i=1;i<o+1;i++)for(let o=1;o<s+1;o++){const s=n[i-1]===a[o-1],c=h[i-1][o]+e,u=h[i][o-1]+r,f=h[i-1][o-1]+(s?0:t);h[i][o]=D(c,u,f)}return i(h,n,a),h[o][s]}};T.distance=T.distanceFactory(),T.printDistanceMatrix=(t,e,r)=>{let n=[];t.forEach((t,e)=>{let r=[];t.forEach((t,e)=>r.push(""+t)),n.push(r.join(" "))}),console.log(`w1: ${e}, w2: ${r}`,n.join("\n"))};const O=(t,e)=>Array.from(Array(t),()=>new Array(e)),D=(...t)=>t.reduce((t,e)=>Math.min(t,e),Number.MAX_VALUE);var E=T}])}));

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : undefined;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && btoa) {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/textfit/textFit.js":
/*!*****************************************!*\
  !*** ./node_modules/textfit/textFit.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * textFit v2.3.1
 * Previously known as jQuery.textFit
 * 11/2014 by STRML (strml.github.com)
 * MIT License
 *
 * To use: textFit(document.getElementById('target-div'), options);
 *
 * Will make the *text* content inside a container scale to fit the container
 * The container is required to have a set width and height
 * Uses binary search to fit text with minimal layout calls.
 * Version 2.0 does not use jQuery.
 */
/*global define:true, document:true, window:true, HTMLElement:true*/

(function(root, factory) {
  "use strict";

  // UMD shim
  if (true) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}(typeof global === "object" ? global : this, function () {
  "use strict";

  var defaultSettings = {
    alignVert: false, // if true, textFit will align vertically using css tables
    alignHoriz: false, // if true, textFit will set text-align: center
    multiLine: false, // if true, textFit will not set white-space: no-wrap
    detectMultiLine: true, // disable to turn off automatic multi-line sensing
    minFontSize: 6,
    maxFontSize: 80,
    reProcess: true, // if true, textFit will re-process already-fit nodes. Set to 'false' for better performance
    widthOnly: false, // if true, textFit will fit text to element width, regardless of text height
    alignVertWithFlexbox: false, // if true, textFit will use flexbox for vertical alignment
  };

  return function textFit(els, options) {

    if (!options) options = {};

    // Extend options.
    var settings = {};
    for(var key in defaultSettings){
      if(options.hasOwnProperty(key)){
        settings[key] = options[key];
      } else {
        settings[key] = defaultSettings[key];
      }
    }

    // Convert jQuery objects into arrays
    if (typeof els.toArray === "function") {
      els = els.toArray();
    }

    // Support passing a single el
    var elType = Object.prototype.toString.call(els);
    if (elType !== '[object Array]' && elType !== '[object NodeList]' &&
            elType !== '[object HTMLCollection]'){
      els = [els];
    }

    // Process each el we've passed.
    for(var i = 0; i < els.length; i++){
      processItem(els[i], settings);
    }
  };

  /**
   * The meat. Given an el, make the text inside it fit its parent.
   * @param  {DOMElement} el       Child el.
   * @param  {Object} settings     Options for fit.
   */
  function processItem(el, settings){
    if (!isElement(el) || (!settings.reProcess && el.getAttribute('textFitted'))) {
      return false;
    }

    // Set textFitted attribute so we know this was processed.
    if(!settings.reProcess){
      el.setAttribute('textFitted', 1);
    }

    var innerSpan, originalHeight, originalHTML, originalWidth;
    var low, mid, high;

    // Get element data.
    originalHTML = el.innerHTML;
    originalWidth = innerWidth(el);
    originalHeight = innerHeight(el);

    // Don't process if we can't find box dimensions
    if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
      if(!settings.widthOnly)
        throw new Error('Set a static height and width on the target element ' + el.outerHTML +
          ' before using textFit!');
      else
        throw new Error('Set a static width on the target element ' + el.outerHTML +
          ' before using textFit!');
    }

    // Add textFitted span inside this container.
    if (originalHTML.indexOf('textFitted') === -1) {
      innerSpan = document.createElement('span');
      innerSpan.className = 'textFitted';
      // Inline block ensure it takes on the size of its contents, even if they are enclosed
      // in other tags like <p>
      innerSpan.style['display'] = 'inline-block';
      innerSpan.innerHTML = originalHTML;
      el.innerHTML = '';
      el.appendChild(innerSpan);
    } else {
      // Reprocessing.
      innerSpan = el.querySelector('span.textFitted');
      // Remove vertical align if we're reprocessing.
      if (hasClass(innerSpan, 'textFitAlignVert')){
        innerSpan.className = innerSpan.className.replace('textFitAlignVert', '');
        innerSpan.style['height'] = '';
        el.className.replace('textFitAlignVertFlex', '');
      }
    }

    // Prepare & set alignment
    if (settings.alignHoriz) {
      el.style['text-align'] = 'center';
      innerSpan.style['text-align'] = 'center';
    }

    // Check if this string is multiple lines
    // Not guaranteed to always work if you use wonky line-heights
    var multiLine = settings.multiLine;
    if (settings.detectMultiLine && !multiLine &&
        innerSpan.scrollHeight >= parseInt(window.getComputedStyle(innerSpan)['font-size'], 10) * 2){
      multiLine = true;
    }

    // If we're not treating this as a multiline string, don't let it wrap.
    if (!multiLine) {
      el.style['white-space'] = 'nowrap';
    }

    low = settings.minFontSize;
    high = settings.maxFontSize;

    // Binary search for highest best fit
    var size = low;
    while (low <= high) {
      mid = (high + low) >> 1;
      innerSpan.style.fontSize = mid + 'px';
      if(innerSpan.scrollWidth <= originalWidth && (settings.widthOnly || innerSpan.scrollHeight <= originalHeight)){
        size = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
      // await injection point
    }
    // found, updating font if differs:
    if( innerSpan.style.fontSize != size + 'px' ) innerSpan.style.fontSize = size + 'px';

    // Our height is finalized. If we are aligning vertically, set that up.
    if (settings.alignVert) {
      addStyleSheet();
      var height = innerSpan.scrollHeight;
      if (window.getComputedStyle(el)['position'] === "static"){
        el.style['position'] = 'relative';
      }
      if (!hasClass(innerSpan, "textFitAlignVert")){
        innerSpan.className = innerSpan.className + " textFitAlignVert";
      }
      innerSpan.style['height'] = height + "px";
      if (settings.alignVertWithFlexbox && !hasClass(el, "textFitAlignVertFlex")) {
        el.className = el.className + " textFitAlignVertFlex";
      }
    }
  }

  // Calculate height without padding.
  function innerHeight(el){
    var style = window.getComputedStyle(el, null);
    return el.clientHeight -
      parseInt(style.getPropertyValue('padding-top'), 10) -
      parseInt(style.getPropertyValue('padding-bottom'), 10);
  }

  // Calculate width without padding.
  function innerWidth(el){
    var style = window.getComputedStyle(el, null);
    return el.clientWidth -
      parseInt(style.getPropertyValue('padding-left'), 10) -
      parseInt(style.getPropertyValue('padding-right'), 10);
  }

  //Returns true if it is a DOM element
  function isElement(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  }

  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  // Better than a stylesheet dependency
  function addStyleSheet() {
    if (document.getElementById("textFitStyleSheet")) return;
    var style = [
      ".textFitAlignVert{",
        "position: absolute;",
        "top: 0; right: 0; bottom: 0; left: 0;",
        "margin: auto;",
        "display: flex;",
        "justify-content: center;",
        "flex-direction: column;",
      "}",
      ".textFitAlignVertFlex{",
        "display: flex;",
      "}",
      ".textFitAlignVertFlex .textFitAlignVert{",
        "position: static;",
      "}",].join("");

    var css = document.createElement("style");
    css.type = "text/css";
    css.id = "textFitStyleSheet";
    css.innerHTML = style;
    document.body.appendChild(css);
  }
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/Card/Card.css":
/*!***************************!*\
  !*** ./src/Card/Card.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./Card.css */ "./node_modules/css-loader/dist/cjs.js!./src/Card/Card.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./src/Card/Card.js":
/*!**************************!*\
  !*** ./src/Card/Card.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _Card_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Card.css */ "./src/Card/Card.css");
/* harmony import */ var _Card_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Card_css__WEBPACK_IMPORTED_MODULE_2__);



var Card = {};

Card.builder = function () {
  return new CardBuilder();
};
/**
 * @param data: {imageSrc: string, url: string, title: string, tags: array<string>, date: string}
 */


Card.createCardFromData = function (data) {
  console.log("Create Card From Data", data);
  return DomBuilder.of("div").attr("class", "card simplePaper").append(createImage(data)).append(createBody(data)).build();
};

/* harmony default export */ __webpack_exports__["default"] = (Card); //========================================================================================

/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

var CardBuilder = function CardBuilder() {
  var _this = this;

  Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, CardBuilder);

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "assignRet", function (expr) {
    expr();
    return _this;
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "imageSrc", function (src) {
    return _this.assignRet(function () {
      return _this._imageSrc = src;
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "url", function (url) {
    return _this.assignRet(function () {
      return _this._url = url;
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "title", function (title) {
    return _this.assignRet(function () {
      return _this._title = title;
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "tags", function (tags) {
    return _this.assignRet(function () {
      return _this._tags = tags;
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "date", function (date) {
    return _this.assignRet(function () {
      return _this._date = date;
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "build", function () {
    return Card.createCardFromData({
      imageSrc: _this._imageSrc,
      url: _this._url,
      title: _this._title,
      tags: _this._tags,
      date: _this._date
    });
  });

  this._imageSrc = "";
  this._url = "";
  this._title = "";
  this._tags = [];
  this._date = "";
};

var createImage = function createImage(data) {
  return DomBuilder.of("a").attr("href", data.url).append(DomBuilder.of("img").attr("class", "card-img-top card-plugin").attr("src", data.imageSrc).attr("href", data.url).attr("alt", data.title).build()).build();
};

var createTitle = function createTitle(data) {
  return DomBuilder.of("a").attr("href", data.url).append(DomBuilder.of("h3").attr("class", "card-title title").inner(data.title).build()).build();
};

var createTags = function createTags(tags) {
  return tags.map(function (tag) {
    return DomBuilder.of("a").attr("class", "badge badge-light").attr("href", "/?q=".concat(tag)).inner(tag).build();
  });
};

var createBody = function createBody(data) {
  return DomBuilder.of("div").attr("class", "card-body").append(createTitle(data)).append(DomBuilder.of("div").append(createTags(data.tags)).build()).append(DomBuilder.of("p").attr("class", "border-top").inner("<b>Last update</b>: <i>".concat(data.date, "</i>")).build()).build();
};

/***/ }),

/***/ "./src/DomBuilder/main/DomBuilder.js":
/*!*******************************************!*\
  !*** ./src/DomBuilder/main/DomBuilder.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");





var DomBuilder = /*#__PURE__*/function () {
  function DomBuilder(element) {
    Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_2__["default"])(this, DomBuilder);

    this.element = element;
  }

  Object(_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_3__["default"])(DomBuilder, [{
    key: "attr",
    value: function attr(name, value) {
      this.element.setAttribute(name, value);
      return this;
    }
  }, {
    key: "append",
    value: function append(element) {
      var _this = this;

      var defaultAction = function defaultAction(e) {
        return _this.element.appendChild(e);
      };

      var type2ActionMap = Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])({
        Array: function Array(e) {
          return e.forEach(function (x) {
            return _this.append(x);
          });
        }
      }, this.constructor.name, function (e) {
        return _this.element.appendChild(e.build());
      });

      var type = element.constructor.name;
      if (type in type2ActionMap) type2ActionMap[type](element);else defaultAction(element);
      return this;
    }
  }, {
    key: "inner",
    value: function inner(value) {
      this.element.innerHTML = value;
      return this;
    }
  }, {
    key: "removeChildren",
    value: function removeChildren() {
      while (this.element.firstChild) {
        this.element.removeChild(this.element.lastChild);
      }

      return this;
    }
  }, {
    key: "html",
    value: function html(value) {
      return this.inner(value);
    }
  }, {
    key: "event",
    value: function event(eventName, lambda) {
      this.element.addEventListener(eventName, lambda);
      return this;
    }
  }, {
    key: "build",
    value: function build() {
      return this.element;
    }
    /**
     * @param {*} elem: string || element
     */

  }], [{
    key: "of",
    value: function of(elem) {
      if (isElement(elem)) {
        return new DomBuilder(elem);
      }

      return new DomBuilder(document.createElement(elem));
    }
  }, {
    key: "ofId",
    value: function ofId(id) {
      return new DomBuilder(document.getElementById(id));
    }
  }]);

  return DomBuilder;
}(); //Returns true if it is a DOM element


function isElement(o) {
  return (typeof HTMLElement === "undefined" ? "undefined" : Object(_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(HTMLElement)) === "object" ? o instanceof HTMLElement //DOM2
  : o && Object(_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(o) === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
}

/* harmony default export */ __webpack_exports__["default"] = (DomBuilder);

/***/ }),

/***/ "./src/Pedroth/Pedroth.js":
/*!********************************!*\
  !*** ./src/Pedroth/Pedroth.js ***!
  \********************************/
/*! exports provided: DomBuilder, WebUtils, Card, Nabla, SearchInput, textFit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../DomBuilder/main/DomBuilder */ "./src/DomBuilder/main/DomBuilder.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DomBuilder", function() { return _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _WebUtils_WebUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../WebUtils/WebUtils */ "./src/WebUtils/WebUtils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebUtils", function() { return _WebUtils_WebUtils__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _Card_Card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Card/Card */ "./src/Card/Card.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Card", function() { return _Card_Card__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var nabla_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nabla.js */ "./node_modules/nabla.js/dist/index.js");
/* harmony import */ var nabla_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nabla_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Nabla", function() { return nabla_js__WEBPACK_IMPORTED_MODULE_3__; });
/* harmony import */ var _SearchInput_SearchInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../SearchInput/SearchInput */ "./src/SearchInput/SearchInput.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SearchInput", function() { return _SearchInput_SearchInput__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var textfit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! textfit */ "./node_modules/textfit/textFit.js");
/* harmony import */ var textfit__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(textfit__WEBPACK_IMPORTED_MODULE_5__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "textFit", function() { return textfit__WEBPACK_IMPORTED_MODULE_5___default.a; });








/***/ }),

/***/ "./src/SearchInput/SearchInput.css":
/*!*****************************************!*\
  !*** ./src/SearchInput/SearchInput.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./SearchInput.css */ "./node_modules/css-loader/dist/cjs.js!./src/SearchInput/SearchInput.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./src/SearchInput/SearchInput.js":
/*!****************************************!*\
  !*** ./src/SearchInput/SearchInput.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DomBuilder/main/DomBuilder */ "./src/DomBuilder/main/DomBuilder.js");
/* harmony import */ var _SearchInput_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SearchInput.css */ "./src/SearchInput/SearchInput.css");
/* harmony import */ var _SearchInput_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_SearchInput_css__WEBPACK_IMPORTED_MODULE_3__);



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }




var uuid = function uuid(key) {
  return "".concat(key).concat(Math.random());
};

var range = function range(a) {
  return function (b) {
    return a < b ? [a].concat(range(a + 1)(b)) : [];
  };
};

var range0 = range(0);

var mod = function mod(n) {
  return function (i) {
    return (n + i % n) % n;
  };
};

var SearchInput = function SearchInput(props) {
  var _this = this;

  Object(_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, SearchInput);

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "getDOM", function () {
    return _this.domComponent;
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "buildDOMComponent", function () {
    return _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of("div").attr("id", _this.id).append(_this.getInput()).append(_this.getButton()).build();
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "getInput", function () {
    return _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of(_this.props.inputDom).attr("id", _this.idInput).event("input", function (e) {
      _this.inputValue = e.target.value;

      _this.props.onChange(_this.inputValue, _this);

      _this.render();
    }).event("keydown", function (evt) {
      var keyCodeAction = {
        Enter: _this.props.onClick,
        Escape: _this.clearSuggestion,
        ArrowUp: _this.highLightNextSuggestion(-1),
        ArrowDown: _this.highLightNextSuggestion(1)
      };
      var action = keyCodeAction[evt.code];
      action && action(_this.inputValue);
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "clearSuggestion", function () {
    _this.selectedIndex = null;
    _this.suggestionList = [];

    _this.setInputValue(_this.inputValue);

    _this.render();
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "highLightNextSuggestion", function (step) {
    return function () {
      if (_this.selectedIndex == null || _this.suggestionList.length === 0) {
        _this.highLightIndex(0);
      } else {
        _this.highLightIndex(mod(_this.suggestionList.length)(_this.selectedIndex + step));
      }
    };
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "highLightIndex", function (index) {
    var domSuggestions = _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].ofId(_this.idSuggestion).build().children[0].children;
    var arrayDomSuggestions = Array.from(domSuggestions);
    arrayDomSuggestions.forEach(function (dom) {
      return dom.style = _this.props.normalStyle;
    });
    var domSuggestionIndex = arrayDomSuggestions.filter(function (dom, i) {
      return index === i;
    });
    _this.selectedIndex = index;
    if (index === null) return;
    var suggestion = _this.suggestionList[index];

    _this.setInputValue(suggestion ? suggestion : _this.inputValue);

    domSuggestionIndex.forEach(function (dom) {
      return dom.style = _this.props.highLightStyle;
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "getButton", function () {
    return _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of(_this.props.buttonDom).event("click", function () {
      return _this.props.onClick(_this.inputValue);
    });
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "render", function () {
    _this.renderSuggestions();
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "renderSuggestions", function () {
    // create suggestion div if none exists
    if (!document.getElementById(_this.idSuggestion)) {
      _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].ofId(_this.id).append(_DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of("div").attr("id", _this.idSuggestion));
    }

    var suggestions = _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].ofId(_this.idSuggestion).removeChildren();

    var box = _this.getSearchBox();

    suggestions.append(_DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of("ul").attr("class", _this.props.ulClass).append(_this.suggestionList.map(_this.createCard))).attr("style", "position: absolute; top:".concat(box.y + box.height, "px; left: ").concat(box.x, "px; width: ").concat(box.width, "; z-index:", 9999));
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "createCard", function (suggestion, index) {
    return _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of("li").attr("style", index === _this.selectedIndex ? _this.props.highLightStyle : _this.props.normalStyle).attr("class", _this.props.liClass).event("click", function () {
      _this.setInputValue(suggestion);

      _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].ofId(_this.idSuggestion).removeChildren();
    }).event("mouseover", function (evt) {
      console.log("Mouse over", index);

      _this.highLightIndex(index);
    }).event("mouseout", function (evt) {
      _this.highLightIndex(null);
    }).html(suggestion);
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "getSearchBox", function () {
    return _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].ofId(_this.idInput).build().getBoundingClientRect();
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "setSuggestions", function (suggestionList) {
    return _this.suggestionList = suggestionList;
  });

  Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "setInputValue", function (value) {
    var input = _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].ofId(_this.idInput).build();

    var nextInput = _this.props.onSetInput(input.value, value);

    _this.inputValue = nextInput;
    input.value = nextInput;
    input.focus();
    input.select();
  });

  this.props = _objectSpread(_objectSpread({}, SearchInput.defaultProps), props);
  this.id = uuid("id");
  this.idInput = uuid("id");
  this.idSuggestion = uuid("id");
  this.domComponent = this.buildDOMComponent(); // not selected

  this.selectedIndex = null;
  this.inputValue = "";
  this.suggestionList = [];
};

Object(_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__["default"])(SearchInput, "defaultProps", {
  onClick: function onClick(input) {},
  onChange: function onChange(input, searchBar) {
    searchBar.setSuggestions(range0(10).map(Math.random));
  },
  onSetInput: function onSetInput(prev, suggestion) {
    return suggestion;
  },
  inputDom: _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of("input").build(),
  buttonDom: _DomBuilder_main_DomBuilder__WEBPACK_IMPORTED_MODULE_2__["default"].of("button").inner("search").build(),
  highLightStyle: "background-color:rgba(100, 100, 100); color:rgb(255,255,255);",
  normalStyle: "",
  ulClass: "search-list",
  liClass: "search-list-item"
});

/* harmony default export */ __webpack_exports__["default"] = (SearchInput);

/***/ }),

/***/ "./src/Utils/Utils.js":
/*!****************************!*\
  !*** ./src/Utils/Utils.js ***!
  \****************************/
/*! exports provided: renderHtml */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderHtml", function() { return renderHtml; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");


function renderHtml(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString;
  var scripts = Array.from(div.getElementsByTagName("script"));
  var asyncLambdas = scripts.map(function (script) {
    return function () {
      return evalScriptTag(script);
    };
  });
  asyncForEach(asyncLambdas);
  return div;
}

function evalScriptTag(scriptTag) {
  var _scriptTag$attributes;

  var globalEval = eval;
  var srcUrl = scriptTag === null || scriptTag === void 0 ? void 0 : (_scriptTag$attributes = scriptTag.attributes["src"]) === null || _scriptTag$attributes === void 0 ? void 0 : _scriptTag$attributes.textContent;

  if (!!srcUrl) {
    return fetch(srcUrl).then(function (code) {
      return code.text();
    }).then(function (code) {
      globalEval(code);
    });
  } else {
    return new Promise(function (re, _) {
      globalEval(scriptTag.innerText);
      re(true);
    });
  }
}

function asyncForEach(_x) {
  return _asyncForEach.apply(this, arguments);
}

function _asyncForEach() {
  _asyncForEach = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(asyncLambdas) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, asyncLambda;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 3;
            _iterator = asyncLambdas[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 12;
              break;
            }

            asyncLambda = _step.value;
            _context.next = 9;
            return asyncLambda();

          case 9:
            _iteratorNormalCompletion = true;
            _context.next = 5;
            break;

          case 12:
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](3);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 18:
            _context.prev = 18;
            _context.prev = 19;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 21:
            _context.prev = 21;

            if (!_didIteratorError) {
              _context.next = 24;
              break;
            }

            throw _iteratorError;

          case 24:
            return _context.finish(21);

          case 25:
            return _context.finish(18);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 14, 18, 26], [19,, 21, 25]]);
  }));
  return _asyncForEach.apply(this, arguments);
}

/***/ }),

/***/ "./src/WebUtils/WebUtils.js":
/*!**********************************!*\
  !*** ./src/WebUtils/WebUtils.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var nabla_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nabla.js */ "./node_modules/nabla.js/dist/index.js");
/* harmony import */ var nabla_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nabla_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Utils_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Utils/Utils */ "./src/Utils/Utils.js");





var WebUtils = {};
/**
 *
 * @param {*} url
 * @param {*} htmlId
 * @param {*} mapLambda: String => String(in html)
 */

WebUtils.retrieveAndAppend = /*#__PURE__*/function () {
  var _ref = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(url, htmlComponent) {
    var mapLambda,
        text,
        child,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mapLambda = _args.length > 2 && _args[2] !== undefined ? _args[2] : function (text) {
              return text;
            };
            console.log("Reading from ".concat(url, ".. appending on ").concat(htmlComponent.id));
            _context.next = 4;
            return fetch(url).then(function (x) {
              return x.text();
            });

          case 4:
            text = _context.sent;
            child = Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_4__["renderHtml"])(mapLambda(text));
            htmlComponent.appendChild(child);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

WebUtils.retrieveAndAppendMarkDown = /*#__PURE__*/function () {
  var _ref2 = Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(url, htmlComponent) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            WebUtils.retrieveAndAppend(url, htmlComponent, function (text) {
              return text;
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

WebUtils.readDb = /*#__PURE__*/Object(_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3() {
  var time, dbJson;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          time = new Date().getTime();

          if (!(!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS)) {
            _context3.next = 7;
            break;
          }

          console.log("retrieving db from cache");
          _context3.next = 5;
          return fetch("resources/db/db.json").then(function (x) {
            return x.json();
          });

        case 5:
          dbJson = _context3.sent;
          localStorage.db = JSON.stringify({
            time: time,
            data: dbJson
          });

        case 7:
          return _context3.abrupt("return", JSON.parse(localStorage.db).data);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}));

WebUtils.sortDb = function (db) {
  return nabla_js__WEBPACK_IMPORTED_MODULE_3__["Sort"].quicksort(db.posts, function (a, b) {
    return date2int(a.date) - date2int(b.date);
  });
};

WebUtils.randomDb = function (db) {
  return nabla_js__WEBPACK_IMPORTED_MODULE_3__["ArrayUtils"].randomPermute(db.posts);
};

WebUtils.getTagsHistogram = function (db) {
  return db.posts.flatMap(function (p) {
    return p.tags;
  }).reduce(function (hist, tag) {
    if (!(tag in hist)) {
      hist[tag] = 1;
    } else {
      hist[tag] += 1;
    }

    return hist;
  }, {});
};

WebUtils.search = function (db) {
  return function (query) {
    if (!query || query.trim() === "") return [];
    var d = nabla_js__WEBPACK_IMPORTED_MODULE_3__["EditDistance"].distance;
    var queryT = query.trim();
    var querySplit = queryT.split("+").map(function (s) {
      return s.trim();
    });
    var tags = Object.keys(WebUtils.getTagsHistogram(db));

    var argMin = function argMin(array) {
      return function (cost) {
        return array.reduce(function (_ref4, v) {
          var _ref5 = Object(_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref4, 2),
              minC = _ref5[0],
              minV = _ref5[1];

          var c = cost(v);
          return c < minC ? [c, v] : [minC, minV];
        }, [Number.MAX_VALUE, null])[1];
      };
    };

    var qTagSet = querySplit.map(function (q) {
      return argMin(tags)(function (t) {
        return d(q, t.substring(0, q.length));
      });
    }).reduce(function (s, v) {
      return s.add(v);
    }, new Set());
    var score = searchScore(qTagSet);
    return db.posts.filter(function (p) {
      return p.tags.some(function (t) {
        return qTagSet.has(t);
      });
    }).sort(function (a, b) {
      return score(b) - score(a);
    });
  };
};

/* harmony default export */ __webpack_exports__["default"] = (WebUtils); //========================================================================================

/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

var searchScore = function searchScore(queryTagSet) {
  return function (post) {
    return post.tags.reduce(function (acc, v) {
      return queryTagSet.has(v) ? acc + 1 : acc;
    }, 0);
  };
};

function date2int(date) {
  var dateStrings = date.split("/");
  var acc = 0;
  var accM = 1;

  for (var j = 0; j < dateStrings.length; j++) {
    acc += parseFloat(dateStrings[j]) * accM;
    accM *= 100;
  }

  return acc;
}

var TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map