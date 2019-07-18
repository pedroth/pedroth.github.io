function generateRecent(db) {
  const sortedDb = VisualExp.sortDb(db);
  console.log("GENERATE RECENT", sortedDb);
}

function generateRandom(db) {}

async function generateMainPage() {
  const db = await VisualExp.readDb();
  generateRecent(db);
  generateRandom(db);
}

generateMainPage();
