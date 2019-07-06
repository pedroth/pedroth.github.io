const VisualExp = {};

VisualExp.retrieveAndAppend = async function(url, htmlId) {
  console.log(`Reading from ${url}.. appending on ${htmlId}`);
  const html = await fetch(url).then(x => x.text());
  $(`#${htmlId}`).html(html); // it doesnt works with plain js
};

VisualExp.readDb = async function() {
  const dbJson = await fetch("resources/db/db.json").then(x => x.json());
  return dbJson;
};

VisualExp.retrieveAndAppend(
  "resources/templates/nav/nav.html",
  "indexContainer"
);

module.exports.default = VisualExp;
