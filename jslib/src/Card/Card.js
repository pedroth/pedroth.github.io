const Card = {};

/**
 * @param data: {imageSrc: string, url: string, title: string, tags: array<string>, date: string}
 */
Card.createCardFromData = data => {
  console.log("Create Card From Data", data);
  return DomBuilder.of("div")
    .attr("class", "card simplePaper")
    .append(createImage(data))
    .append(createBody(data))
    .build();
};

module.exports = Card;

//========================================================================================
/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

const createImage = data =>
  DomBuilder.of("a")
    .attr("href", data.url)
    .append(
      DomBuilder.of("img")
        .attr("class", "card-img-top card-plugin")
        .attr("src", data.imageSrc)
        .attr("href", data.url)
        .attr("alt", data.title)
        .build()
    )
    .build();

const createTitle = data =>
  DomBuilder.of("a")
    .attr("href", data.url)
    .append(
      DomBuilder.of("h3")
        .attr("class", "card-title title")
        .inner(data.title)
        .build()
    )
    .build();

const createTags = tags =>
  tags.map(tag =>
    DomBuilder.of("a")
      .attr("class", "badge badge-light")
      .attr("href", `/?q=${tag}`)
      .inner(tag)
      .build()
  );

const createBody = data =>
  DomBuilder.of("div")
    .attr("class", "card-body")
    .append(createTitle(data))
    .append(
      DomBuilder.of("div")
        .append(createTags(data.tags))
        .build()
    )
    .append(
      DomBuilder.of("p")
        .attr("class", "border-top")
        .inner(data.date)
        .build()
    )
    .build();
