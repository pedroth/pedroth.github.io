console.log("Hello from nav!!");

function selectPage(url) {
  url2page = {
    p: p => {
      const slashSplit = p.split("/");
      const filename = slashSplit[slashSplit.length - 1];
      VisualExp.retrieveAndAppend(`${p}/${filename}.html`, "navContainer");
    },
    q: q =>
      VisualExp.retrieveAndAppend(
        `resources/templates/search/search.html`,
        "navContainer"
      )
  };
  firstSplit = url.split("?");
  if (firstSplit.length === 1) {
    VisualExp.retrieveAndAppend(
      "resources/templates/main/main.html",
      "navContainer"
    );
  } else {
    secondSplit = firstSplit[1].split("=");
    if (secondSplit.length > 0 && secondSplit[0] in url2page) {
      url2page[secondSplit[0]](secondSplit[1]);
    } else {
      VisualExp.retrieveAndAppend(
        "resources/templates/main/main.html",
        "navContainer"
      );
    }
  }
}

function navMain() {
  const url = window.location.href;
  selectPage(url);
  // render equations
  console.log("Rendering equations");
  setTimeout(() => MathJax.typeset(), 100);
}

navMain();
