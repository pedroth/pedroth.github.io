class DomBuilder {
  constructor(element) {
    this.element = element;
  }

  attr(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  append(element) {
    if (element instanceof Array) {
      element.forEach(x => this.element.appendChild(x));
    } else {
      this.element.appendChild(element);
    }
    return this;
  }

  inner(value) {
    this.element.innerHTML = value;
    return this;
  }

  build() {
    return this.element;
  }

  /**
   * @param {*} elem: string || element
   */
  static of(elem) {
    if (isElement(elem)) {
      return new ElementBuilder(elem);
    }
    return new ElementBuilder(document.createElement(elem));
  }
}

//Returns true if it is a DOM element
function isElement(o) {
  return typeof HTMLElement === "object"
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === "object" &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === "string";
}

module.exports.default = DomBuilder;
