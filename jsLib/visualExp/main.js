const VisualExp = {};

VisualExp.retrieveAndAppend = async function(url, htmlId) {
  const html = await fetch(url).then(x => x.json);
  document.getElementById(htmlId).innerHTML = html;
};

module.exports.default = VisualExp;
