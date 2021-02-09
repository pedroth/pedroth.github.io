import DomBuilder from "../DomBuilder/main/DomBuilder";
import "./SearchInput.css";
const uuid = key => `${key}${Math.random()}`;
const mod = n => i => (n + (i % n)) % n;

class SearchInput {
  constructor(props) {
    this.props = { ...SearchInput.defaultProps, ...props };
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
    DomBuilder.of(this.props.inputDom)
      .attr("id", this.idInput)
      .event("input", e => {
        this.inputValue = e.target.value;
        this.props.onChange(this.inputValue, this);
        this.render();
      })
      .event("keydown", evt => {
        const keyCodeAction = {
          Enter: this.props.onClick,
          Escape: this.clearSuggestion,
          ArrowUp: this.highLightNextSuggestion(-1),
          ArrowDown: this.highLightNextSuggestion(1)
        };
        const action = keyCodeAction[evt.code];
        action && action(this.inputValue);
      });

  clearSuggestion = () => {
    this.selectedIndex = null;
    this.suggestionList = [];
    this.setInputValue(this.inputValue);
    this.render();
  };

  highLightNextSuggestion = step => () => {
    if (this.selectedIndex == null || this.suggestionList.length === 0) {
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

    const arrayDomSuggestions = Array.from(domSuggestions);
    arrayDomSuggestions.forEach(dom => (dom.style = this.props.normalStyle));

    const domSuggestionIndex = arrayDomSuggestions.filter(
      (dom, i) => index === i
    );

    this.selectedIndex = index;
    if (index === null) return;

    const suggestion = this.suggestionList[index];
    this.setInputValue(suggestion ? suggestion : this.inputValue);
    domSuggestionIndex.forEach(dom => (dom.style = this.props.highLightStyle));
  };

  getButton = () =>
    DomBuilder.of(this.props.buttonDom).event("click", () =>
      this.props.onClick(this.inputValue)
    );

  render = () => {
    this.renderSuggestions();
  };

  renderSuggestions = () => {
    // create suggestion div if none exists
    if (!document.getElementById(this.idSuggestion)) {
      DomBuilder.ofId(this.id).append(
        DomBuilder.of("div").attr("id", this.idSuggestion)
      );
    }

    const suggestions = DomBuilder.ofId(this.idSuggestion).removeChildren();
    const box = this.getSearchBox();
    suggestions
      .append(
        DomBuilder.of("ul")
          .attr("class", this.props.ulClass)
          .append(this.suggestionList.map(this.createCard))
      )
      .attr(
        "style",
        `position: absolute; top:${box.y + box.height}px; left: ${
          box.x
        }px; width: ${box.width}; z-index:${9999}`
      );
  };

  createCard = (suggestion, index) =>
    DomBuilder.of("li")
      .attr(
        "style",
        index === this.selectedIndex
          ? this.props.highLightStyle
          : this.props.normalStyle
      )
      .attr("class", this.props.liClass)
      .event("click", () => {
        this.setInputValue(suggestion);
        DomBuilder.ofId(this.idSuggestion).removeChildren();
      })
      .event("mouseover", evt => {
        this.highLightIndex(index);
      })
      .event("mouseout", evt => {
        this.highLightIndex(null);
      })
      .html(suggestion);

  getSearchBox = () =>
    DomBuilder.ofId(this.idInput).build().getBoundingClientRect();

  setSuggestions = suggestionList => (this.suggestionList = suggestionList);

  setInputValue = value => {
    const input = DomBuilder.ofId(this.idInput).build();
    const nextInput = this.props.onSetInput(input.value, value);
    this.inputValue = nextInput;
    input.value = nextInput;
    input.focus();
    input.select();
  };

  static defaultProps = {
    onClick: input => {},
    onChange: (input, searchBar) => {
      searchBar.setSuggestions([1, 2, 3].map(Math.random));
    },
    onSetInput: (prev, suggestion) => suggestion,
    inputDom: DomBuilder.of("input").build(),
    buttonDom: DomBuilder.of("button").inner("search").build(),
    highLightStyle:
      "background-color:rgba(100, 100, 100); color:rgb(255,255,255);",
    normalStyle: "",
    ulClass: "search-list",
    liClass: "search-list-item"
  };
}

export default SearchInput;
