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

function getCardsInRow(posts, colPerRows) {
  const row = DomBuilder.of("div").attr(
    "style",
    "display: flex; max-width: 100%"
  );
  for (let i = 0; i < colPerRows; i++) {
    const post = posts[i];
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
  }
  const rowDiv = row.build();
  const rowResize = getRowReSize(rowDiv);
  window.sizeObservers.push(rowResize);
  rowResize();
  return rowDiv;
}

/**
 *
 * @param {*} db: Database
 * @param {*} k: Elements per row
 */
function generateRecent(db, k = 3) {
  const sortedDb = WebUtils.sortDb(db);
  DomBuilder.ofId("recent").append(getCardsInRow(sortedDb, k));
}

/**
 *
 * @param {*} db: Database
 * @param {*} k: Elements per row
 */
function generateRandom(db, k = 3) {
  const randomDb = WebUtils.randomDb(db);
  DomBuilder.ofId("random").append(getCardsInRow(randomDb, k));
}

async function generateMainPage() {
  const db = await WebUtils.readDb();
  generateRecent(db);
  generateRandom(db);
}

generateMainPage();
