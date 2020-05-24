const getCardGrid = cards => {};

// main
(() => {
  let searchTerm = decodeURIComponent(
    window.location.href.split("?")[1].split("=")[1]
  );

  WebUtils.readDb().then(db => {
    db;
    DomBuilder.ofId("resultsHeader")
      .append(DomBuilder.of("h1").inner(`Results for "${searchTerm}"`))
      .append();
  });
})();
