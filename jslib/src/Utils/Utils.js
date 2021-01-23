export function renderHtml(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  const scripts = Array.from(div.getElementsByTagName("script"));
  const asyncLambdas = scripts.map(script => () => evalScriptTag(script));
  asyncForEach(asyncLambdas);
  return div;
}

function evalScriptTag(scriptTag) {
  const globalEval = eval;
  const srcUrl = scriptTag?.attributes["src"]?.textContent;
  if (!!srcUrl) {
    return fetch(srcUrl)
      .then(code => code.text())
      .then(code => {
        globalEval(code);
      });
  } else {
    return new Promise((re, _) => {
      globalEval(scriptTag.innerText);
      re(true);
    });
  }
}

async function asyncForEach(asyncLambdas) {
  for (const asyncLambda of asyncLambdas) {
    await asyncLambda();
  }
}
