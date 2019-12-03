const { Sort, ArrayUtils } = require("nabla.js");
const DomBuilder = require("../../DomBuilder/main/DomBuilder");
const TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;

const VisualExp = {};

VisualExp.DomBuilder = DomBuilder;

VisualExp.retrieveAndAppend = async function(url, htmlId) {
  console.log(`Reading from ${url}.. appending on ${htmlId}`);
  const html = await fetch(url).then(x => x.text());
  $(`#${htmlId}`).html(html);
  /**
   * We have to use jquery to run <script> tags in html, vanilla js doesn't work.
   * vanilla js: document.getElementById(htmlId).innerHTML = html;
   * jquery does some processing to the innerHTML string
   */
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
    (a, b) => date2int(a.date) - date2int(b.date) < 0
  );
};

VisualExp.randomDb = function(db) {
  return ArrayUtils.randomPermute(db.experiments);
};

/**
 * @param data: {imageSrc: string, url: string, title: string, tags: array<string>, date: string}
 */
VisualExp.createCardFromData = function(data) {
  console.log("Create Card From Data", data);
  const card = DomBuilder.of("div")
    .attr("class", "card simplePaper")
    .append(
      DomBuilder.of("a")
        .attr("href", data.url)
        .append(
          DomBuilder.of("img")
            .attr("class", "card-img-top card-plugin")
            .attr("src", data.imageSrc)
            .attr("href", data.url)
            .attr("alt", data.title)
            .build()
        )
        .build()
    )
    .append(
      DomBuilder.of("div")
        .attr("class", "card-body")
        .append(
          DomBuilder.of("a")
            .attr("href", data.url)
            .append(
              DomBuilder.of("h3")
                .attr("class", "card-title title")
                .inner(data.title)
                .build()
            )
            .build()
        )
        .append(
          DomBuilder.of("div")
            .append(createTagElement(data.tags))
            .build()
        )
        .append(
          DomBuilder.of("p")
            .attr("class", "border-top")
            .inner(data.date)
            .build()
        )
        .build()
    )
    .build();
  return card;
};

// Util functions
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

function createTagElement(tags) {
  return tags.map(tag =>
    DomBuilder.of("a")
      .attr("class", "badge badge-light")
      .attr("href", `/?q=${tag}`)
      .inner(tag)
      .build()
  );
}

// MAIN
VisualExp.retrieveAndAppend(
  "resources/templates/nav/nav.html",
  "indexContainer"
);

// exports
module.exports = VisualExp;
