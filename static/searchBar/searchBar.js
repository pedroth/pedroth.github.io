const { DomBuilder } = Pedroth;
const uuid = key => `${key}${Math.random()}`;

class SearchBar {
  constructor(props) {
    this.props = props;
    this.id = uuid("id");
    this.idSuggestion = uuid("id");
    this.idInput = uuid("id");
    this.domComponent = this.buildDOMComponent();
    // not selected
    this.selectedIndex = -1;
    this.inputValue = "";
    this.suggestionList = [];
  }

  getComponent = () => this.domComponent;

  buildDOMComponent = () =>
    DomBuilder.of("div")
      .attr("id", this.id)
      .append(this.getInput())
      .append(this.getButton())
      .build();

  getInput = () =>
    DomBuilder.of("input")
      .attr("id", this.idInput)
      .event("input", e => {
        this.setSuggestions(range0(10).map(Math.random));
        this.inputValue = e.target.value;
        this.render();
      })
      .event("keydown", evt => {
        const keyCodeAction = {
          13: this.props.onClick
        };
        const action = keyCodeAction[evt.keyCode];
        action && action(this.inputValue);
      });

  getButton = () =>
    DomBuilder.of("button")
      .event("click", () => this.props.onClick(this.inputValue))
      .inner(this.props.buttonLabel);

  render = () => {
    this.renderSuggestions();
  };

  renderSuggestions = () => {
    if (!document.getElementById(this.idSuggestion)) {
      DomBuilder.of(document.body).append(
        DomBuilder.of("div").attr("id", this.idSuggestion)
      );
    }
    DomBuilder.ofId(this.idSuggestion).removeChildren();
    const box = this.getSearchBox();
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
    return DomBuilder.of("li")
      .attr("style", "background-color: 'white', color: 'black'")
      .attr("class", "list-group-item")
      .event("click", () => {
        DomBuilder.ofId(this.idInput).build().value = suggestion;
        this.inputValue = suggestion;
        DomBuilder.ofId(this.idSuggestion).removeChildren();
      })
      .event(
        "mouseover",
        evt =>
          (evt.target.style =
            "background-color:rgba(100, 100, 100); color:rgb(255,255,255);")
      )
      .event("mouseout", evt => (evt.target.style = ""))
      .html(suggestion);
  };

  getSearchBox = () =>
    DomBuilder.ofId(this.idInput)
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
