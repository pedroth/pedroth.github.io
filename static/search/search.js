const getCardGrid = posts => {
  const row = DomBuilder.of("div").attr("class", "row");
  posts.forEach(post => {
    const col = DomBuilder.of("div")
      .attr("class", "col-lg-4 col-md-6 col-sm-12")
      .attr("style", "margin-top:10px; margin-bottom: 10px;")
      .append(
        Card.builder()
          .imageSrc(`${post.src}/${post.id}.gif`)
          .url(`/?p=${post.src}/${post.id}.html`)
          .title(post.title)
          .tags(post.tags)
          .date(post.date)
          .build()
      )
      .build();
    row.append(col);
  });
  const rowDiv = row.build();
  const rowResize = getRowReSize(rowDiv);
  window.sizeObservers.push(rowResize);
  rowResize();
  return rowDiv;
};

function getRowReSize(rowDiv) {
  return () => {};
}

// main
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
