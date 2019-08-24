const Sort = require("../Sort/main/Sort");
const VisualExp = {};

const TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3;

function date2int(date) {
  var dateStrs = date.split("/");
  var acm = 0;
  var ide = 1;
  for (var j = 0; j < dateStrs.length; j++) {
    acm += parseFloat(dateStrs[j]) * ide;
    ide *= 100;
  }
  return acm;
}

//Returns true if it is a DOM element
function isElement(o) {
  return typeof HTMLElement === "object"
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === "object" &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === "string";
}

class ElementBuilder {
  constructor(element) {
    this.element = element;
  }

  attribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  build() {
    return this.element;
  }

  static from(elem) {
    if (isElement(elem)) {
      return new ElementBuilder(elem);
    }
    return document.createElement(document.createElement(elem));
  }

  static fromElement;
}

VisualExp.ElementBuilder = elem => ElementBuilder.from(elem);

VisualExp.retrieveAndAppend = async function(url, htmlId) {
  console.log(`Reading from ${url}.. appending on ${htmlId}`);
  const html = await fetch(url).then(x => x.text());
  $(`#${htmlId}`).html(html); // it doesnt works with plain js
};

VisualExp.readDb = async function() {
  const time = new Date().getTime();
  if (!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS) {
    const dbJson = await fetch("resources/db/db.json").then(x => x.json());
    localStorage.db = JSON.stringify({ time: time, data: dbJson });
  }
  return JSON.parse(localStorage.db).data;
};

VisualExp.sortDb = function(db) {
  return Sort.quicksort(
    db.experiments,
    (a, b) => date2int(a.date) - date2int(b.date) > 0
  );
};

VisualExp.createCardFromData = function(data) {
  const card = VisualExp.ElementBuilder.from("div")
    .attribute("class", "card simplePaper")
    .attribute("style", "width: 18rem");

  const img = VisualExp.ElementBuilder.from("img")
    .attribute("class", "card-img-top")
    .attribute("src", data.imageSrc)
    .attribute("href", data.url);

  const cardBody = VisualExp.ElementBuilder.from("div").
};

VisualExp.retrieveAndAppend(
  "resources/templates/nav/nav.html",
  "indexContainer"
);

module.exports.default = VisualExp;
