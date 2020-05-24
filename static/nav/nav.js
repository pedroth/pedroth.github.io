function selectPage(url) {
  const { retrieveAndAppend } = WebUtils;
  defaultPage = () =>
    retrieveAndAppend("static/main/main.html", "navContainer");
  url2page = {
    p: p => retrieveAndAppend(`static/app/app.html`, "navContainer"),
    q: q => retrieveAndAppend(`static/search/search.html`, "navContainer")
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

let tagsHist = {};
WebUtils.readDb()
  .then(WebUtils.getTagsHistogram)
  .then(tagsH => (tagsHist = tagsH));

function getRecommendations(query, searchBar) {
  if (!query || query.replaceAll(" ", "") === "") {
    searchBar.setSuggestions([]);
    return;
  }
  const querySplit = query.split("+");
  const finalQuery =
    querySplit.length > 1
      ? querySplit[querySplit.length - 1].trim()
      : querySplit[0].trim();
  const { distance } = Nabla.EditDistance;
  const sortedTags = Object.keys(tagsHist)
    .map(t => ({
      name: t,
      distance: distance(finalQuery, t.substring(0, finalQuery.length))
    }))
    .sort((a, b) => a.distance - b.distance);
  searchBar.setSuggestions(
    sortedTags
      .filter(t => t.distance <= 7)
      .filter((t, i) => i < 7)
      .map(z => z.name)
  );
}

function onSetSuggestion(prevValue, suggestion) {
  const split = prevValue.split("+").map(z => z.trim());
  if (split.length > 1) {
    split[split.length - 1] = suggestion;
    return split.join(" + ");
  }
  return suggestion;
}

//========================================================================================
/*                                                                                      *
 *                                         Main                                         *
 *                                                                                      */
//========================================================================================

const searchComponent = new SearchInput({
  onClick: searchInput => (window.location.href = `?q=${searchInput}`),
  onChange: getRecommendations,
  onSetInput: onSetSuggestion,
  buttonDom: DomBuilder.of("button")
    .attr("class", "navIcons")
    .append(DomBuilder.of("i").attr("class", "fas fa-search"))
    .build(),
  inputDom: DomBuilder.of("input")
    .attr("class", "searchClass")
    .attr("type", "text")
    .attr("placeholder", "Search... use + to concat")
    .build(),
  highLightStyle:
    "background-color:rgba(255, 255, 255); color:rgb(100, 100, 100)",
  normalStyle: "background-color:rgba(100, 100, 100); color:rgb(255, 255, 255)"
});
DomBuilder.ofId("searchInput").append(searchComponent.getDOM());
navMain();
