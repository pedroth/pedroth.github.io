const { DomBuilder, Card, WebUtils } = Pedroth;
function getCardsInRow(arrayOfCards, colPerRows) {
  const { DomBuilder, Card } = Pedroth;
  const row = DomBuilder.of("div").attr("class", "row");
  for (let i = 0; i < colPerRows; i++) {
    const card = arrayOfCards[i];
    const col = DomBuilder.of("div")
      .attr("class", "col-lg-4 col-md-6 col-sm-12")
      .attr("style", "margin-top:10px; margin-bottom: 10px;")
      .append(
        Card.createCardFromData({
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
  const sortedDb = WebUtils.sortDb(db);
  document.getElementById("recent").appendChild(getCardsInRow(sortedDb, k));
}

/**
 *
 * @param {*} db: Database
 * @param {*} k: Elements per row
 */
function generateRandom(db, k = 3) {
  const randomDb = WebUtils.randomDb(db);
  document.getElementById("random").appendChild(getCardsInRow(randomDb, k));
}

async function generateMainPage() {
  const db = await WebUtils.readDb();
  generateRecent(db);
  generateRandom(db);
}

generateMainPage();
