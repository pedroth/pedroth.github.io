let tagsHist = {};
WebUtils.readDb()
  .then(WebUtils.getTagsHistogram)
  .then(tagsH => (tagsHist = tagsH));

function selectPage(url) {
  const { renderHtml } = WebUtils;
  const navContainer = document.getElementById("navContainer");
  defaultPage = () => renderHtml("static/main/main.html", navContainer);
  url2page = {
    p: p => renderHtml(`static/app/app.html`, navContainer), // as post pages
    q: q => renderHtml(`static/search/search.html`, navContainer), // search query
    s: s => renderHtml(`static/${s}`, navContainer) // as static pages
  };
  [_, address] = url.split("?");
  if (!!address) {
    [type, value] = address.split("=");
    if (!!type && type in url2page) {
      url2page[type](value);
      return;
    }
  }
  defaultPage();
}

function navMain() {
  const url = window.location.href;
  selectPage(url);
}

function getRecommendations(query, searchBar) {
  if (!query || query.trim() === "") {
    searchBar.setSuggestions([]);
    return;
  }
  const alpha = 1;
  const len = array => array.length;
  const subStr = (string, length) => string.substring(0, length);
  const { distance: d } = Nabla.EditDistance;
  const qSplit = query.split("+").map(s => s.trim());
  const finalQuery = len(qSplit) > 1 ? qSplit[len(qSplit) - 1] : qSplit[0];
  const tags = Object.keys(tagsHist);
  const sortedTags = tags
    .map(t => {
      console.log(
        `d(${finalQuery}, ${subStr(t, len(finalQuery))}) = ${d(
          finalQuery,
          subStr(t, len(finalQuery))
        )}`
      );
      return t;
    })
    .map(t => ({
      name: t,
      distance:
        (d(finalQuery, subStr(t, len(finalQuery))) + d(finalQuery, t)) / 2
    }))
    .sort((a, b) => a.distance - b.distance);
  console.log(sortedTags);
  const suggestions = sortedTags
    .filter(t => t.distance <= 7)
    .filter((t, i) => i < 7)
    .map(z => z.name);
  searchBar.setSuggestions(suggestions);
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
