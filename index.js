const {
  DomBuilder,
  Card,
  WebUtils,
  SearchInput,
  Nabla,
  textFit,
  Utils
} = Pedroth;

WebUtils.renderHtml("/static/nav/nav.html", document.getElementById("root"));

Utils.addResizeObservers(window);
