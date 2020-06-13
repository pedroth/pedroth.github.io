const getCardGrid = posts => {
  const row = DomBuilder.of("div").attr("class", "row");
  posts.forEach(post => {
    const col = DomBuilder.of("div")
      .attr("class", "col-lg-4 col-md-6 col-sm-12")
      .attr("style", "margin-top:10px; margin-bottom: 10px;")
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
  return row.build();
};

// main
(() => {
  WebUtils.readDb().then(db => {
    DomBuilder.ofId("results").append(
      getCardGrid(WebUtils.sortDb(db).reverse())
    );
  });
})();
