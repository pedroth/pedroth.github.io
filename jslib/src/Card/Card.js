import "./Card.css";
const Card = {};

Card.builder = () => new CardBuilder();

/**
 * @param data: {imageSrc: string, url: string, title: string, tags: array<string>, date: string}
 */
Card.createCardFromData = data => {
  return DomBuilder.of("div")
    .attr("class", "card simplePaper")
    .append(createImage(data))
    .append(createBody(data))
    .build();
};

export default Card;

//========================================================================================
/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

class CardBuilder {
  constructor() {
    this._imageSrc = "";
    this._url = "";
    this._title = "";
    this._tags = [];
    this._date = "";
  }
  assignRet = expr => {
    expr();
    return this;
  };

  imageSrc = src => this.assignRet(() => (this._imageSrc = src));
  url = url => this.assignRet(() => (this._url = url));
  title = title => this.assignRet(() => (this._title = title));
  tags = tags => this.assignRet(() => (this._tags = tags));
  date = date => this.assignRet(() => (this._date = date));

  build = () =>
    Card.createCardFromData({
      imageSrc: this._imageSrc,
      url: this._url,
      title: this._title,
      tags: this._tags,
      date: this._date
    });
}

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
    .append(DomBuilder.of("div").append(createTags(data.tags)).build())
    .append(
      DomBuilder.of("p")
        .attr("class", "border-top")
        .inner(`<b>Last update</b>: <i>${data.date}</i>`)
        .build()
    )
    .build();
