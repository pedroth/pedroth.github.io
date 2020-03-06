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

/***/ "./src/Card/Card.js":
/*!**************************!*\
  !*** ./src/Card/Card.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var Card = {};\n/**\r\n * @param data: {imageSrc: string, url: string, title: string, tags: array<string>, date: string}\r\n */\n\nCard.createCardFromData = function (data) {\n  console.log(\"Create Card From Data\", data);\n  return DomBuilder.of(\"div\").attr(\"class\", \"card simplePaper\").append(createImage(data)).append(createBody(data)).build();\n};\n\nmodule.exports = Card; //========================================================================================\n\n/*                                                                                      *\r\n *                                   Private functions                                  *\r\n *                                                                                      */\n//========================================================================================\n\nvar createImage = function createImage(data) {\n  return DomBuilder.of(\"a\").attr(\"href\", data.url).append(DomBuilder.of(\"img\").attr(\"class\", \"card-img-top card-plugin\").attr(\"src\", data.imageSrc).attr(\"href\", data.url).attr(\"alt\", data.title).build()).build();\n};\n\nvar createTitle = function createTitle(data) {\n  return DomBuilder.of(\"a\").attr(\"href\", data.url).append(DomBuilder.of(\"h3\").attr(\"class\", \"card-title title\").inner(data.title).build()).build();\n};\n\nvar createTags = function createTags(tags) {\n  return tags.map(function (tag) {\n    return DomBuilder.of(\"a\").attr(\"class\", \"badge badge-light\").attr(\"href\", \"/?q=\".concat(tag)).inner(tag).build();\n  });\n};\n\nvar createBody = function createBody(data) {\n  return DomBuilder.of(\"div\").attr(\"class\", \"card-body\").append(createTitle(data)).append(DomBuilder.of(\"div\").append(createTags(data.tags)).build()).append(DomBuilder.of(\"p\").attr(\"class\", \"border-top\").inner(data.date).build()).build();\n};\n\n//# sourceURL=webpack://Pedroth/./src/Card/Card.js?");

/***/ }),

/***/ "./src/DomBuilder/main/DomBuilder.js":
/*!*******************************************!*\
  !*** ./src/DomBuilder/main/DomBuilder.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar DomBuilder = /*#__PURE__*/function () {\n  function DomBuilder(element) {\n    _classCallCheck(this, DomBuilder);\n\n    this.element = element;\n  }\n\n  _createClass(DomBuilder, [{\n    key: \"attr\",\n    value: function attr(name, value) {\n      this.element.setAttribute(name, value);\n      return this;\n    }\n  }, {\n    key: \"append\",\n    value: function append(element) {\n      var _this = this;\n\n      var defaultAction = function defaultAction(e) {\n        return _this.element.appendChild(e);\n      };\n\n      var type2ActionMap = _defineProperty({\n        Array: function Array(e) {\n          return e.forEach(function (x) {\n            return _this.append(x);\n          });\n        }\n      }, this.constructor.name, function (e) {\n        return _this.element.appendChild(e.build());\n      });\n\n      var type = element.constructor.name;\n      if (type in type2ActionMap) type2ActionMap[type](element);else defaultAction(element);\n      return this;\n    }\n  }, {\n    key: \"inner\",\n    value: function inner(value) {\n      this.element.innerHTML = value;\n      return this;\n    }\n  }, {\n    key: \"removeChildren\",\n    value: function removeChildren() {\n      while (this.element.firstChild) {\n        this.element.removeChild(this.element.lastChild);\n      }\n    }\n  }, {\n    key: \"html\",\n    value: function html(value) {\n      return this.inner(value);\n    }\n  }, {\n    key: \"event\",\n    value: function event(eventName, lambda) {\n      this.element.addEventListener(eventName, lambda);\n      return this;\n    }\n  }, {\n    key: \"build\",\n    value: function build() {\n      return this.element;\n    }\n    /**\r\n     * @param {*} elem: string || element\r\n     */\n\n  }], [{\n    key: \"of\",\n    value: function of(elem) {\n      if (isElement(elem)) {\n        return new DomBuilder(elem);\n      }\n\n      return new DomBuilder(document.createElement(elem));\n    }\n  }, {\n    key: \"ofId\",\n    value: function ofId(id) {\n      return new DomBuilder(document.getElementById(id));\n    }\n  }]);\n\n  return DomBuilder;\n}(); //Returns true if it is a DOM element\n\n\nfunction isElement(o) {\n  return (typeof HTMLElement === \"undefined\" ? \"undefined\" : _typeof(HTMLElement)) === \"object\" ? o instanceof HTMLElement //DOM2\n  : o && _typeof(o) === \"object\" && o !== null && o.nodeType === 1 && typeof o.nodeName === \"string\";\n}\n\nmodule.exports = DomBuilder;\n\n//# sourceURL=webpack://Pedroth/./src/DomBuilder/main/DomBuilder.js?");

/***/ }),

/***/ "./src/Pedroth/Pedroth.js":
/*!********************************!*\
  !*** ./src/Pedroth/Pedroth.js ***!
  \********************************/
/*! exports provided: DomBuilder, WebUtils, Card, Nabla, SearchInput */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DomBuilder\", function() { return DomBuilder; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WebUtils\", function() { return WebUtils; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Card\", function() { return Card; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Nabla\", function() { return Nabla; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SearchInput\", function() { return SearchInput; });\nvar DomBuilder = __webpack_require__(/*! ../DomBuilder/main/DomBuilder */ \"./src/DomBuilder/main/DomBuilder.js\");\n\nvar WebUtils = __webpack_require__(/*! ../WebUtils/WebUtils */ \"./src/WebUtils/WebUtils.js\");\n\nvar Card = __webpack_require__(/*! ../Card/Card */ \"./src/Card/Card.js\");\n\nvar Nabla = __webpack_require__(/*! nabla.js */ \"nabla.js\");\n\nvar SearchInput = __webpack_require__(/*! ../SearchInput/SearchInput */ \"./src/SearchInput/SearchInput.js\");\n\n\n\n//# sourceURL=webpack://Pedroth/./src/Pedroth/Pedroth.js?");

/***/ }),

/***/ "./src/SearchInput/SearchInput.js":
/*!****************************************!*\
  !*** ./src/SearchInput/SearchInput.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// const DomBuilder = require(\"../DomBuilder/main/DomBuilder\");\n// const uuid = key => `${key}${Math.random()}`;\n// const range = a => b => (a < b ? [a].concat(range(a + 1)(b)) : []);\n// const range0 = range(0);\n// const mod = n => i => (n + (i % n)) % n;\n// class SearchInput {\n//   static defaultProps = {\n//     onClick: input => {},\n//     onChange: (input, searchBar) => {\n//       searchBar.setSuggestions(range0(10).map(Math.random));\n//     },\n//     inputDom: DomBuilder.of(\"input\").build(),\n//     buttonDom: DomBuilder.of(\"button\")\n//       .inner(\"search\")\n//       .build()\n//   };\n//   constructor(props) {\n//     this.props = { ...SearchInput.defaultProps, ...props };\n//     this.id = uuid(\"id\");\n//     this.idInput = uuid(\"id\");\n//     this.idSuggestion = uuid(\"id\");\n//     this.domComponent = this.buildDOMComponent();\n//     // not selected\n//     this.selectedIndex = null;\n//     this.inputValue = \"\";\n//     this.suggestionList = [];\n//   }\n//   getDOM = () => this.domComponent;\n//   buildDOMComponent = () =>\n//     DomBuilder.of(\"div\")\n//       .attr(\"id\", this.id)\n//       .append(this.getInput())\n//       .append(this.getButton())\n//       .build();\n//   getInput = () =>\n//     DomBuilder.of(this.props.inputDom)\n//       .attr(\"id\", this.idInput)\n//       .event(\"input\", e => {\n//         this.inputValue = e.target.value;\n//         this.props.onChange(this.inputValue, this);\n//         this.render();\n//       })\n//       .event(\"keydown\", evt => {\n//         console.log(\"Key pressed\");\n//         const keyCodeAction = {\n//           13: this.props.onClick,\n//           38: this.highLightNextSuggestion(-1),\n//           40: this.highLightNextSuggestion(1)\n//         };\n//         const action = keyCodeAction[evt.keyCode];\n//         action && action(this.inputValue);\n//       });\n//   highLightNextSuggestion = step => () => {\n//     if (this.selectedIndex == null) {\n//       this.highLightIndex(0);\n//     } else {\n//       this.highLightIndex(\n//         mod(this.suggestionList.length)(this.selectedIndex + step)\n//       );\n//     }\n//   };\n//   highLightIndex = index => {\n//     const domSuggestions = DomBuilder.ofId(this.idSuggestion).build()\n//       .children[0].children;\n//     const arrayDomSuggestions = Array.from(domSuggestions);\n//     arrayDomSuggestions.forEach(dom => (dom.style = \"\"));\n//     const domSuggestionIndex = arrayDomSuggestions.filter(\n//       (dom, i) => index === i\n//     );\n//     this.selectedIndex = index;\n//     if (index === null) return;\n//     DomBuilder.ofId(this.idInput).build().value = this.suggestionList[index];\n//     this.inputValue = this.suggestionList[index];\n//     domSuggestionIndex.forEach(dom => (dom.style = this.highLightStyle));\n//   };\n//   highLightStyle =\n//     \"background-color:rgba(100, 100, 100); color:rgb(255,255,255);\";\n//   getButton = () =>\n//     DomBuilder.of(this.props.buttonDom).event(\"click\", () =>\n//       this.props.onClick(this.inputValue)\n//     );\n//   render = () => {\n//     console.log(\"Render\", this.selectedIndex);\n//     this.renderSuggestions();\n//   };\n//   renderSuggestions = () => {\n//     if (!document.getElementById(this.idSuggestion)) {\n//       DomBuilder.of(document.body).append(\n//         DomBuilder.of(\"div\").attr(\"id\", this.idSuggestion)\n//       );\n//     }\n//     DomBuilder.ofId(this.idSuggestion).removeChildren();\n//     const box = this.getSearchBox();\n//     DomBuilder.ofId(this.idSuggestion)\n//       .append(\n//         DomBuilder.of(\"ul\")\n//           .attr(\"class\", \"list-group\")\n//           .append(this.suggestionList.map(this.createCard))\n//       )\n//       .attr(\n//         \"style\",\n//         `position: absolute; top:${box.y + box.height}px; left: ${\n//           box.x\n//         }px; width: ${box.width}`\n//       );\n//   };\n//   createCard = (suggestion, index) =>\n//     DomBuilder.of(\"li\")\n//       .attr(\"style\", index === this.selectedIndex ? this.highLightStyle : \"\")\n//       .attr(\"class\", \"list-group-item\")\n//       .event(\"click\", () => {\n//         DomBuilder.ofId(this.idInput).build().value = suggestion;\n//         this.inputValue = suggestion;\n//         DomBuilder.ofId(this.idSuggestion).removeChildren();\n//       })\n//       .event(\"mouseover\", evt => {\n//         console.log(\"Mouse over\", index);\n//         this.highLightIndex(index);\n//       })\n//       .event(\"mouseout\", evt => {\n//         this.highLightIndex(null);\n//       })\n//       .html(suggestion);\n//   getSearchBox = () =>\n//     DomBuilder.ofId(this.idInput)\n//       .build()\n//       .getBoundingClientRect();\n//   setSuggestions = suggestionList => (this.suggestionList = suggestionList);\n// }\n// module.exports = SearchInput;\n\n//# sourceURL=webpack://Pedroth/./src/SearchInput/SearchInput.js?");

/***/ }),

/***/ "./src/WebUtils/WebUtils.js":
/*!**********************************!*\
  !*** ./src/WebUtils/WebUtils.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\nvar _require = __webpack_require__(/*! nabla.js */ \"nabla.js\"),\n    Sort = _require.Sort,\n    ArrayUtils = _require.ArrayUtils;\n\nvar WebUtils = {};\n\nWebUtils.retrieveAndAppend = /*#__PURE__*/function () {\n  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, htmlId) {\n    var html;\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            console.log(\"Reading from \".concat(url, \".. appending on \").concat(htmlId));\n            _context.next = 3;\n            return fetch(url).then(function (x) {\n              return x.text();\n            });\n\n          case 3:\n            html = _context.sent;\n            $(\"#\".concat(htmlId)).html(html);\n            /**\r\n             * We have to use jquery to run <script> tags in html, vanilla js doesn't work.\r\n             * vanilla js: document.getElementById(htmlId).innerHTML = html;\r\n             * jquery does some processing to the innerHTML string\r\n             */\n\n          case 5:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n\n  return function (_x, _x2) {\n    return _ref.apply(this, arguments);\n  };\n}();\n\nWebUtils.readDb = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {\n  var time, dbJson;\n  return regeneratorRuntime.wrap(function _callee2$(_context2) {\n    while (1) {\n      switch (_context2.prev = _context2.next) {\n        case 0:\n          time = new Date().getTime();\n\n          if (!(!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS)) {\n            _context2.next = 6;\n            break;\n          }\n\n          _context2.next = 4;\n          return fetch(\"resources/db/db.json\").then(function (x) {\n            return x.json();\n          });\n\n        case 4:\n          dbJson = _context2.sent;\n          localStorage.db = JSON.stringify({\n            time: time,\n            data: dbJson\n          });\n\n        case 6:\n          return _context2.abrupt(\"return\", JSON.parse(localStorage.db).data);\n\n        case 7:\n        case \"end\":\n          return _context2.stop();\n      }\n    }\n  }, _callee2);\n}));\n\nWebUtils.sortDb = function (db) {\n  return Sort.quicksort(db.experiments, function (a, b) {\n    return date2int(a.date) - date2int(b.date) < 0;\n  });\n};\n\nWebUtils.randomDb = function (db) {\n  return ArrayUtils.randomPermute(db.experiments);\n};\n\nmodule.exports = WebUtils; //========================================================================================\n\n/*                                                                                      *\r\n *                                   Private functions                                  *\r\n *                                                                                      */\n//========================================================================================\n\nfunction date2int(date) {\n  var dateStrs = date.split(\"/\");\n  var acm = 0;\n  var ide = 1;\n\n  for (var j = 0; j < dateStrs.length; j++) {\n    acm += parseFloat(dateStrs[j]) * ide;\n    ide *= 100;\n  }\n\n  return acm;\n}\n\nvar TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;\n\n//# sourceURL=webpack://Pedroth/./src/WebUtils/WebUtils.js?");

/***/ }),

/***/ "nabla.js":
/*!***************************!*\
  !*** external "nabla.js" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nabla.js\");\n\n//# sourceURL=webpack://Pedroth/external_%22nabla.js%22?");

/***/ })

/******/ });
});