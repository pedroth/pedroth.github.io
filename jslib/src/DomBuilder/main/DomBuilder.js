class DomBuilder {
  constructor(element) {
    this.element = element;
  }

  attr(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }
  /**
   *
   * @param {*} element: Dom | DomBuilder | Array<Dom | DomBuilder>
   */
  append(element) {
    const defaultAction = e => this.element.appendChild(e);
    const type2ActionMap = {
      Array: e => e.forEach(x => this.append(x)),
      [this.constructor.name]: e => this.element.appendChild(e.build())
    };
    const type = element.constructor.name;

    if (type in type2ActionMap) type2ActionMap[type](element);
    else defaultAction(element);

    return this;
  }

  inner(value) {
    this.element.innerHTML = value;
    return this;
  }

  removeChildren() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.lastChild);
    }
    return this;
  }

  html(value) {
    return this.inner(value);
  }

  event(eventName, lambda) {
    this.element.addEventListener(eventName, lambda);
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
      return new DomBuilder(elem);
    }
    return new DomBuilder(document.createElement(elem));
  }

  static ofId(id) {
    return new DomBuilder(document.getElementById(id));
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

export default DomBuilder;
