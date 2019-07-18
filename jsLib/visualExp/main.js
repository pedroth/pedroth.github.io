const VisualExp = {};

const TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3;

VisualExp.retrieveAndAppend = async function(url, htmlId) {
  console.log(`Reading from ${url}.. appending on ${htmlId}`);
  const html = await fetch(url).then(x => x.text());
  $(`#${htmlId}`).html(html); // it doesnt works with plain js
};

VisualExp.readDb = async function() {
  const time = new Date().getTime();
  if (!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS) {
    const dbJson = await fetch("resources/db/db.json").then(x => x.json());
    localStorage.db = { time: time, data: dbJson };
  }
  return localStorage.db.data;
};

VisualExp.createCardFromData = function(data) {};

VisualExp.retrieveAndAppend(
  "resources/templates/nav/nav.html",
  "indexContainer"
);

module.exports.default = VisualExp;
