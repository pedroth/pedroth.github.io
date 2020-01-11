console.log("Hello from nav!!");

function selectPage(url) {
  defaultPage = () =>
    VisualExp.retrieveAndAppend(
      "resources/templates/main/main.html",
      "navContainer"
    );
  url2page = {
    p: p => {
      VisualExp.retrieveAndAppend(
        `resources/templates/app/app.html`,
        "navContainer"
      );
    },
    q: q =>
      VisualExp.retrieveAndAppend(
        `resources/templates/search/search.html`,
        "navContainer"
      )
  };
  firstSplit = url.split("?");
  if (firstSplit.length === 1) {
    defaultPage();
  } else {
    secondSplit = firstSplit[1].split("=");
    if (secondSplit.length > 0 && secondSplit[0] in url2page) {
      url2page[secondSplit[0]](secondSplit[1]);
    } else {
      defaultPage();
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
