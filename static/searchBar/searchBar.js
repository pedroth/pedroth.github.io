const { DomBuilder } = Pedroth;

class Suggestions {
  constructor(id, parentId) {
    this.id = id;
    this.parentId = parentId;
    // not selected
    this.selectedIndex = -1;
    this.suggestionList = [];
  }

  createCard = suggestion => {
    return DomBuilder.of("ul")
      .attr("style", "background-color: 'white', color: 'black'")
      .html(suggestion);
  };

  renderSuggestionList = () => {
    DomBuilder.ofId(this.id)
      .append(
        DomBuilder.of("li").append(this.suggestionList.map(this.createCard))
      )
      .attr(
        "style",
        `position: absolute, top:${this.getTopPosition()}, left: ${this.getLeftPosition()}`
      );
  };

  getTopPosition = () => DomBuilder.ofId(this.parentId).build().offsetTop;

  getLeftPosition = () => DomBuilder.ofId(this.parentId).build().offsetLeft;

  render = () => {
    const element = DomBuilder.ofId(this.id);
    if (!element.element)
      document.body.appendChild(
        DomBuilder.of("div")
          .attr("id", this.id)
          .build()
      );
    this.renderSuggestionList();
  };

  pushSuggestion = suggestion => this.suggestionList.push(suggestion);
}

const s = new Suggestions("suggestions", "searchInput");

const searchFunc = () =>
  (window.location.href = `?q=${DomBuilder.ofId("searchInput").build().value}`);

DomBuilder.ofId("searchInput")
  .event("input", e => {
    s.pushSuggestion(e.target.value);
    s.render();
  })
  .event("keydown", evt => {
    keyCodeAction = {
      13: searchFunc
    };
    keyCodeAction[evt.keyCode]();
  });
DomBuilder.ofId("searchSubmit").event("click", searchFunc);
