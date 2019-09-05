const Sort = require("../Sort/main/Sort");
const TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;

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

function createTagElement(tags) {
  return tags.map(tag =>
    ElementBuilder.of("a")
      .attribute("class", "badge badge-light")
      .attribute("href", `/?q=${tag}`)
      .innerHtml(tag)
      .build()
  );
}

class ElementBuilder {
  constructor(element) {
    this.element = element;
  }

  attribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  append(element) {
    if (element instanceof Array) {
      element.forEach(x => this.element.appendChild(x));
    } else {
      this.element.appendChild(element);
    }
    return this;
  }

  innerHtml(value) {
    console.log("Inner HTML", value, this);
    this.element.innerHTML = value;
    return this;
  }

  build() {
    return this.element;
  }

  /**
   * @param {*} elem: string || element
   */
  static of(elem) {
    if (isElement(elem)) {
      return new ElementBuilder(elem);
    }
    return new ElementBuilder(document.createElement(elem));
  }
}

const VisualExp = {};

VisualExp.ElementBuilder = ElementBuilder;

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

/**
 * @param data: {imageSrc: string, url: string, title: string, tags: array<string>}
 */
VisualExp.createCardFromData = function(data) {
  console.log("Create Card From Data", data);
  const card = VisualExp.ElementBuilder.of("div")
    .attribute("class", "card simplePaper")
    .attribute("style", "width: 20rem")
    .append(
      VisualExp.ElementBuilder.of("a")
        .attribute("href", data.url)
        .append(
          VisualExp.ElementBuilder.of("img")
            .attribute("class", "card-img-top")
            .attribute("src", data.imageSrc)
            .attribute("href", data.url)
            .attribute("alt", data.title)
            .build()
        )
        .build()
    )
    .append(
      VisualExp.ElementBuilder.of("div")
        .attribute("class", "card-body")
        .append(
          VisualExp.ElementBuilder.of("a")
            .attribute("href", data.url)
            .append(
              VisualExp.ElementBuilder.of("h3")
                .attribute("class", "card-title title")
                .innerHtml(data.title)
                .build()
            )
            .build()
        )
        .append(createTagElement(data.tags))
        .build()
    )
    .build();
  return card;
};

VisualExp.retrieveAndAppend(
  "resources/templates/nav/nav.html",
  "indexContainer"
);

module.exports.default = VisualExp;
