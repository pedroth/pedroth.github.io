// Utils.js imported in index.js
// DomBuilder.js imported in index.js
// WebUtils.js imported in index.js
const { getCardsInRow } = Utils;

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
