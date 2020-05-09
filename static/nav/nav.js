function selectPage(url) {
  defaultPage = () =>
    WebUtils.retrieveAndAppend("static/main/main.html", "navContainer");
  url2page = {
    p: p => WebUtils.retrieveAndAppend(`static/app/app.html`, "navContainer"),
    q: q =>
      WebUtils.retrieveAndAppend(`static/search/search.html`, "navContainer")
  };
  firstSplit = url.split("?");
  if (firstSplit.length > 1) {
    secondSplit = firstSplit[1].split("=");
    if (secondSplit.length > 0 && secondSplit[0] in url2page) {
      url2page[secondSplit[0]](secondSplit[1]);
      return;
    }
  }
  defaultPage();
}

function navMain() {
  const url = window.location.href;
  selectPage(url);
  // render equations
  console.log("Rendering equations");
  setTimeout(() => MathJax.typeset(), 100);
}

function getRecommendations(query, searchBar) {
  const { WebUtils } = Pedroth;
  const searchDb = WebUtils.searchDb(WebUtils.readDb());
  searchBar.setSuggestions(["p", "ped", "pedro", "pedroth"]);
}

const searchComponent = new SearchInput({
  onClick: searchInput => (window.location.href = `?q=${searchInput}`),
  onChange: getRecommendations,
  buttonDom: DomBuilder.of("button")
    .attr("class", "navIcons")
    .append(DomBuilder.of("i").attr("class", "fas fa-search"))
    .build(),
  inputDom: DomBuilder.of("input")
    .attr("class", "searchClass")
    .inner("search...")
    .build(),
  highLightStyle:
    "background-color:rgba(255, 255, 255); color:rgb(100, 100, 100)",
  normalStyle: "background-color:rgba(100, 100, 100); color:rgb(255, 255, 255)"
});
DomBuilder.ofId("searchInput").append(searchComponent.getDOM());

navMain();
