const VisualExp = {};

VisualExp.retrieveAndAppend = async function(url, htmlId) {
  const html = await fetch(url).then(x => x.text());
  document.getElementById(htmlId).innerHTML = html;
};

VisualExp.retrieveAndAppend(
  "resources/templates/nav/nav.html",
  "indexContainer"
);

module.exports.default = VisualExp;
