// Utils.js imported in index.js
// DomBuilder.js imported in index.js
// WebUtils.js imported in index.js
const { getCardGrid } = Utils;
//========================================================================================
/*                                                                                      *
 *                                         MAIN                                         *
 *                                                                                      */
//========================================================================================

(() => {
  let query = decodeURIComponent(
    window.location.href.split("?")[1].split("=")[1]
  );
  WebUtils.readDb().then(db => {
    DomBuilder.ofId("resultsHeader").append(
      DomBuilder.of("h1").inner(`Results for "${query}"`)
    );
    DomBuilder.ofId("results").append(getCardGrid(WebUtils.search(db)(query)));
    DomBuilder.ofId("google").append(
      DomBuilder.of("a")
        .attr("class", "btn btn-primary")
        .attr("style", "flex-grow: 1")
        .attr(
          "href",
          `https://www.google.com/search?q=${encodeURI(
            `site:https://pedroth.github.io ${query}`
          )}`
        )
        .attr("target", `_blank`)
        .append(DomBuilder.of("h2").inner("Google"))
    );
  });
})();
