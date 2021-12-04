const len = array => array.length;
const subStr = (string, length) => string.substring(0, length);

let tagsHist = {};
WebUtils.readDb()
  .then(WebUtils.getTagsHistogram)
  .then(tagsH => (tagsHist = tagsH));

let titles = {};
WebUtils.readDb().then(data => {
  titles = data.posts.map(({ title }) => title);
});

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
  const queryT = query.toLowerCase().trim();
  const tags = Object.keys(tagsHist);
  const { distance: editDistance } = Nabla.EditDistance;
  const suggestions = [...titles, ...tags]
    .map(s => s.toLowerCase())
    .filter(s => s.includes(queryT))
    .sort((a, b) => editDistance(a.substring(0, queryT.length), queryT) - editDistance(b.substring(0, queryT.length), queryT));
  searchBar.setSuggestions(suggestions.splice(0, 5))
}

//========================================================================================
/*                                                                                      *
 *                                         Main                                         *
 *                                                                                      */
//========================================================================================

const searchComponent = new SearchInput({
  onClick: searchInput => (window.location.href = `?q=${searchInput}`),
  onChange: getRecommendations,
  buttonDom: DomBuilder.of("button")
    .attr("class", "navIcons")
    .append(DomBuilder.of("i").attr("class", "fas fa-search"))
    .build(),
  inputDom: DomBuilder.of("input")
    .attr("class", "searchClass")
    .attr("type", "text")
    .attr("placeholder", "Search...")
    .build(),
  highLightStyle:
    "background-color:rgba(255, 255, 255); color:rgb(100, 100, 100)",
  normalStyle: "background-color:rgba(100, 100, 100); color:rgb(255, 255, 255)"
});
DomBuilder.ofId("searchInput").append(searchComponent.getDOM());
navMain();
