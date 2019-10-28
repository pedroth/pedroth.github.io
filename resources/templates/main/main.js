function getCardsInRow(arrayOfCards, colPerRows) {
  const row = VisualExp.DomBuilder.of("div").attr("class", "row");
  for (let i = 0; i < colPerRows; i++) {
    const card = arrayOfCards[i];
    const col = VisualExp.DomBuilder.of("div")
      .attr("class", "col-lg-4 col-sm-12")
      .attr("style", "margin-top:10px; margin-bottom: 10px;")
      .append(
        VisualExp.createCardFromData({
          imageSrc: card.src + `/${card.id}.gif`,
          url: `/?p=${card.src}`,
          title: card.title,
          tags: card.tags,
          date: card.date
        })
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
  const sortedDb = VisualExp.sortDb(db);
  document.getElementById("recent").appendChild(getCardsInRow(sortedDb, k));
}

/**
 *
 * @param {*} db: Database
 * @param {*} k: Elements per row
 */
function generateRandom(db, k = 3) {
  const randomDb = VisualExp.randomDb(db);
  document.getElementById("random").appendChild(getCardsInRow(randomDb, k));
}

async function generateMainPage() {
  const db = await VisualExp.readDb();
  generateRecent(db);
  generateRandom(db);
}

generateMainPage();
