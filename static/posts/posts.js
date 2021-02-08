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
    const row = getCardsInRow(posts.splice(i * k, k), k);
    body.append(row);
  }
  return body.build();
};

//========================================================================================
/*                                                                                      *
 *                                         MAIN                                         *
 *                                                                                      */
//========================================================================================

(() => {
  WebUtils.readDb().then(db => {
    DomBuilder.ofId("results").append(
      getCardGrid(WebUtils.sortDb(db).reverse())
    );
  });
})();
