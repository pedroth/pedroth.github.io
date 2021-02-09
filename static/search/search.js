//========================================================================================
/*                                                                                      *
 *                                      CARDS GRID                                      *
 *                                                                                      */
//========================================================================================

function getRowReSize(rowDiv) {
  return () => {
    if (window.innerWidth >= window.innerHeight) {
      const n = rowDiv.childNodes.length;
      const w = window.innerWidth / n;
      rowDiv.style["flex-direction"] = "row";
      rowDiv.childNodes.forEach(child => {
        child.style.width = `${w}px`;
        child.style["max-width"] = `100%`;
      });
    } else {
      rowDiv.style["flex-direction"] = "column";
      rowDiv.style["align-items"] = "center";
      const w = window.innerWidth * 0.77;
      rowDiv.childNodes.forEach(child => (child.style.width = `${w}px`));
    }
  };
}

function getCardsInRow(posts) {
  const row = DomBuilder.of("div").attr(
    "style",
    "display: flex; max-width: 100%"
  );
  posts.forEach(post => {
    const col = DomBuilder.of("div")
      .attr("style", "margin: 10px;")
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
  // from index.js
  window.sizeObservers.push(rowResize);
  rowResize();
  return rowDiv;
}

const getCardGrid = (posts, k = 3) => {
  const body = DomBuilder.of("div");
  const n = Math.floor(posts.length / k);
  for (let i = 0; i < n; i++) {
    const row = getCardsInRow([...posts].splice(i * k, k), k);
    body.append(row);
  }
  body.append(getCardsInRow([...posts].splice(n * k, k)));
  return body.build();
};

//========================================================================================
/*                                                                                      *
 *                                         MAIN                                         *
 *                                                                                      */
//========================================================================================

(() => {
  let query = decodeURIComponent(
    window.location.href.split("?")[1].split("=")[1]
  );

  console.log("Enter here!");

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
