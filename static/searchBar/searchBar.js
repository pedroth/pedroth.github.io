const { DomBuilder } = Pedroth;

{
  /* <input id="searchInput" />
      <button type="submit" id="searchSubmit">
        Search
      </button> */
}

class SearchBar {
  constructor(props) {
    this.id = `id` + Math.random();
    this.idSuggestion = `id` + Math.random();
    this.domComponent = this.buildDOMComponent(props);
    // not selected
    this.selectedIndex = -1;
    this.inputValue = "";
    this.suggestionList = [];
  }

  getComponent = () => this.domComponent;

  buildDOMComponent = props => {
    return DomBuilder.of("div")
      .attr("id", this.id)
      .append(this.getInput(props))
      .append(this.getButton(props))
      .build();
  };

  getInput = props =>
    DomBuilder.of("input")
      .event("input", e => {
        this.setSuggestions(range0(10).map(Math.random));
        this.inputValue = e.target.value;
        this.render();
      })
      .event("keydown", evt => {
        const keyCodeAction = {
          13: props.onClick
        };
        const action = keyCodeAction[evt.keyCode];
        action && action(this.inputValue);
      });

  getButton = props =>
    DomBuilder.of("button")
      .event("click", () => props.onClick(this.inputValue))
      .inner(props.buttonLabel);

  render = () => {
    if (!document.getElementById(this.idSuggestion)) {
      DomBuilder.of(document.body).append(
        DomBuilder.of("div").attr("id", this.idSuggestion)
      );
    }
    DomBuilder.ofId(this.idSuggestion).removeChildren();
    const box = this.getSearchBox();
    console.log("Box", box);
    DomBuilder.ofId(this.idSuggestion)
      .append(
        DomBuilder.of("ul")
          .attr("class", "list-group")
          .append(this.suggestionList.map(this.createCard))
      )
      .attr(
        "style",
        `position: absolute; top:${box.y + box.height}px; left: ${
          box.x
        }px; width: ${box.width}`
      );
  };

  createCard = suggestion => {
    return (
      DomBuilder.of("li")
        .attr("style", "background-color: 'white', color: 'black'")
        .attr("class", "list-group-item")
        // .event("click", "")
        // .event("mouseover", "")
        .html(suggestion)
    );
  };

  getSearchBox = () =>
    DomBuilder.ofId(this.id)
      .build()
      .getBoundingClientRect();

  setSuggestions = suggestionList => (this.suggestionList = suggestionList);
}

const searchComponent = new SearchBar({
  onClick: searchInput => (window.location.href = `?q=${searchInput}`),
  buttonLabel: "search"
});
DomBuilder.ofId("root").append(searchComponent.getComponent());

const range = a => b => (a < b ? [a].concat(range(a + 1)(b)) : []);
const range0 = range(0);
