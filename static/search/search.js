(() => {
  // main
  DomBuilder.ofId("resultsHeader").append(
    DomBuilder.of("h1").inner(
      `Results for "${window.location.href.split("?")[1].split("=")[1]}"`
    )
  );

  DomBuilder.ofId("searchTerm").append(
    DomBuilder.of("h1").inner(
      `Results for "${window.location.href.split("?")[1].split("=")[1]}"`
    )
  );
})();
