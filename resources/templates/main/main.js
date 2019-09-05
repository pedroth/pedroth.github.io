function generateRecent(db) {
  const sortedDb = VisualExp.sortDb(db);
  console.log("GENERATE RECENT", sortedDb);
  sortedDb.map(x => {
    document.getElementById("recent").appendChild(
      VisualExp.ElementBuilder.of("div")
        .attribute("class", "row")
        .append(
          VisualExp.ElementBuilder.of("div")
            .attribute("class", "col")
            .append(
              VisualExp.createCardFromData({
                imageSrc: x.src + `/${x.id}.gif`,
                url: `/?p=${x.id}`,
                title: x.title,
                tags: x.tags
              })
            )
            .build()
        )
        .build()
    );
  });
}

function generateRandom(db) {}

async function generateMainPage() {
  const db = await VisualExp.readDb();
  generateRecent(db);
  generateRandom(db);
}

generateMainPage();
