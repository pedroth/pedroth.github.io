const { DomBuilder, Nabla } = Pedroth;
const { ArrayUtils } = Nabla;
const uuid = key => `${key}${Math.random()}`;
const range = a => b => (a < b ? [a].concat(range(a + 1)(b)) : []);
const range0 = range(0);
const mod = n => i => (n + (i % n)) % n;
const doIO = list => () => list.forEach(f => f());

class SearchBar {
  static defaultProps = {
    onClick: input => {},
    onChange: (input, searchBar) => {
      searchBar.setSuggestions(range0(10).map(Math.random));
    },
    buttonLabel: "search"
  };

  constructor(props) {
    this.props = { ...SearchBar.defaultProps, ...props };
    this.id = uuid("id");
    this.idInput = uuid("id");
    this.idSuggestion = uuid("id");
    this.domComponent = this.buildDOMComponent();
    // not selected
    this.selectedIndex = null;
    this.inputValue = "";
    this.suggestionList = [];
  }

  getDOM = () => this.domComponent;

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
        this.inputValue = e.target.value;
        this.props.onChange(this.inputValue, this);
        this.render();
      })
      .event("keydown", evt => {
        console.log("Key pressed");
        const keyCodeAction = {
          13: this.props.onClick,
          38: this.highLightNextSuggestion(-1),
          40: this.highLightNextSuggestion(1)
        };
        const action = keyCodeAction[evt.keyCode];
        action && action(this.inputValue);
      });

  highLightNextSuggestion = step => () => {
    if (this.selectedIndex == null) {
      this.highLightIndex(0);
    } else {
      this.highLightIndex(
        mod(this.suggestionList.length)(this.selectedIndex + step)
      );
    }
  };

  highLightIndex = index => {
    const domSuggestions = DomBuilder.ofId(this.idSuggestion).build()
      .children[0].children;

    ArrayUtils.forEach(domSuggestions, dom => (dom.style = ""));

    const domSuggestionIndex = ArrayUtils.filter(
      domSuggestions,
      (dom, i) => index === i
    );

    this.selectedIndex = index;
    if (index === null) return;

    DomBuilder.ofId(this.idInput).build().value = this.suggestionList[index];
    this.inputValue = this.suggestionList[index];

    ArrayUtils.forEach(
      domSuggestionIndex,
      dom => (dom.style = this.highLightStyle)
    );
  };

  highLightStyle =
    "background-color:rgba(100, 100, 100); color:rgb(255,255,255);";

  getButton = () =>
    DomBuilder.of("button")
      .event("click", () => this.props.onClick(this.inputValue))
      .inner(this.props.buttonLabel);

  render = () => {
    console.log("Render", this.selectedIndex);
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

  createCard = (suggestion, index) => {
    return DomBuilder.of("li")
      .attr("style", index === this.selectedIndex ? this.highLightStyle : "")
      .attr("class", "list-group-item")
      .event("click", () => {
        DomBuilder.ofId(this.idInput).build().value = suggestion;
        this.inputValue = suggestion;
        DomBuilder.ofId(this.idSuggestion).removeChildren();
      })
      .event("mouseover", evt => {
        console.log("Mouse over", index);
        this.highLightIndex(index);
      })
      .event("mouseout", evt => {
        this.highLightIndex(null);
      })
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
DomBuilder.ofId("root").append(searchComponent.getDOM());
