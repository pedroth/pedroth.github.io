function getCardsInRow(posts, colPerRows) {
  const row = DomBuilder.of("div").attr("class", "row");
  for (let i = 0; i < colPerRows; i++) {
    const card = posts[i];
    const col = DomBuilder.of("div")
      .attr("class", "col-lg-4 col-md-6 col-sm-12")
      .attr("style", "margin-top:10px; margin-bottom: 10px;")
      .append(
        Card.builder()
          .imageSrc(card.src + `/${card.id}.gif`)
          .url(`/?p=${card.src}`)
          .title(card.title)
          .tags(card.tags)
          .date(card.date)
          .build()
      )
      .build();
    row.append(col);
  }
  return row.build();
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
