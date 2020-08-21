//========================================================================================
/*                                                                                      *
 *                                         Vec2                                         *
 *                                                                                      */
//========================================================================================

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toArray() {
    return [this.x, this.y];
  }

  map(lambda) {
    return new Vec2(...this.toArray().map(lambda));
  }

  reduce(foldLambda, acc = 0) {
    return this.toArray().reduce(foldLambda, acc);
  }

  op(vec2, operator) {
    const v = vec2.toArray();
    return new Vec2(...this.toArray().map((x, i) => operator(x, v[i])));
  }

  sum(vec2) {
    return this.op(vec2, (a, b) => a + b);
  }

  add(vec2) {
    return this.sum(vec2);
  }

  sub(vec2) {
    return this.op(vec2, (a, b) => a - b);
  }

  mul(vec2) {
    return this.op(vec2, (a, b) => a * b);
  }

  div(vec2) {
    return this.op(vec2, (a, b) => a / b);
  }

  dot(vec2) {
    return this.mul(vec2).reduce((acc, x) => acc + x, 0);
  }

  scale(r) {
    return this.map(x => x * r);
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  equals(vec2, precision = 1e-5) {
    if (!(vec2 instanceof Vec2)) return false;
    return this.sub(vec2).length() < precision;
  }

  static random(min = 0, max = 1) {
    let minimum = Math.min(min, max);
    let maximum = Math.max(min, max);
    return new Vec2(
      ...[1, 2].map(() => minimum + (maximum - minimum) * Math.random())
    );
  }

  static of(x, y) {
    return new Vec2(x, y);
  }

  static fromArray([x, y]) {
    return new Vec2(x, y);
  }

  static ZERO = new Vec2(0, 0);

  static e1 = Vec2.of(1, 0);
  static e2 = Vec2.of(0, 1);
}

//========================================================================================
/*                                                                                      *
 *                                          Box                                         *
 *                                                                                      */
//========================================================================================
class Box {
  constructor(min, max) {
    this.min = min.op(max, Math.min);
    this.max = max.op(min, Math.max);
    this.center = min.add(max).scale(1 / 2);
    this.diagonal = max.sub(min);
    this.width = this.diagonal.x;
    this.height = this.diagonal.y;
  }
  /**
   * Union of boxes
   * @param {*} box
   */
  add(box) {
    const { min, max } = this;
    return new Box(min.op(box.min, Math.min), max.op(box.max, Math.max));
  }

  /**
   * Intersection of boxes
   * @param {*} box
   */
  sub(box) {
    const { min, max } = this;
    const newMin = min.op(box.min, Math.max);
    const newMax = max.op(box.max, Math.min);
    const newDiag = newMax.sub(newMin);
    const e1P = newDiag.dot(Vec2.e1);
    const e2P = newDiag.dot(Vec2.e2);
    return e1P < 0 || e2P < 0 ? Box.ZERO : new Box(newMin, newMax);
  }

  move(vector) {
    return new Box(this.min.add(vector), this.max.add(vector));
  }

  collidesWith(box) {
    const actionByTypes = [
      { type: Box, action: () => !this.sub(box).isEmpty() },
      { type: Vec2, action: () => !this.sub(new Box(box, box)).isEmpty() }
    ];
    for (let i = 0; i < actionByTypes.length; i++) {
      if (box instanceof actionByTypes[i].type) {
        return actionByTypes[i].action();
      }
    }
  }

  randomPointInside() {
    return this.min.add(Vec2.random().mul(Vec2.of(this.width, this.height)));
  }

  isEmpty() {
    return this.equals(Box.ZERO);
  }

  equals(box) {
    if (!(box instanceof Box)) return false;
    if (this == Box.ZERO) return true;
    return this.min.equals(box.min) && this.max.equals(box.max);
  }

  static ZERO = new Box(Vec2.ZERO, Vec2.ZERO);

  static ofHtml(elem) {
    const { top, left, height, width } = elem.getBoundingClientRect();
    const corner = Vec2.of(top, left);
    return new Box(corner, corner.add(Vec2.of(height, width)));
  }
}

//========================================================================================
/*                                                                                      *
 *                                         Utils                                        *
 *                                                                                      */
//========================================================================================

const randomInt = (min = 0) => (max = 1) => {
  let minimum = Math.min(min, max);
  let maximum = Math.max(min, max);
  return Math.floor(minimum + (maximum - minimum) * Math.random());
};

const randomInt0 = randomInt();

const argmax = (array, profit) =>
  array.reduce(
    (acc, v) => {
      const p = profit(v);
      return p > acc.p ? { p, v: v } : acc;
    },
    { p: Number.MIN_VALUE, v: null }
  ).v;

//========================================================================================
/*                                                                                      *
 *                                  Poisson Disk Sample                                 *
 *                                                                                      */
//========================================================================================

const TITLE_HEIGHT = 175;
const MAIN_BOX = new Box(
  Vec2.of(window.innerHeight * 0.25, window.innerWidth * 0.1),
  Vec2.of(window.innerHeight * 0.9, window.innerWidth * 0.9)
);

const createTagWithBox = (tag, box, power) => {
  return createTag(
    tag,
    power,
    (width, height, color, fontColor) => `
  position: absolute;
  top:${box.min.x}px; 
  left:${box.min.y}px;
  width:${width};
  height:${height};
  background-color:rgb(${color[0]},${color[1]},${color[2]});
  color:rgb(${fontColor[0]},${fontColor[1]},${fontColor[2]})
  `
  );
};

const createTagWithPos = function (tag, { x, y }, power) {
  return createTag(
    tag,
    power,
    (width, height, color, fontColor) => `
  position: absolute;
  top:${x - height / 2}px; 
  left:${y - width / 2}px;
  width:${width};
  height:${height};
  background-color:rgb(${color[0]},${color[1]},${color[2]});
  color:rgb(${fontColor[0]},${fontColor[1]},${fontColor[2]})
  `
  );
};

const createTag = function (tag, power, getStyle) {
  const widths = [0.1 * window.innerWidth, 0.2 * window.innerWidth];
  const heights = [0.025 * window.innerHeight, 0.05 * window.innerHeight];
  const red = [1, 0, 0];
  const blue = [0, 0, 1];
  const color = blue
    .map(x => x * (1 - power))
    .map((x, i) => x + red[i] * power)
    .map(x => Math.floor(x * 255));
  const width = widths[0] * (1 - power) + widths[1] * power;
  const height = heights[0] * (1 - power) + heights[1] * power;
  const fontColor = color.map(x => 255);
  const tagEl = DomBuilder.of("a")
    .attr("class", "badge")
    .attr("href", `/?q=${tag}`)
    .attr("style", getStyle(width, height, color, fontColor))
    .inner(tag)
    .build();
  DomBuilder.ofId("results").append(tagEl);
  return tagEl;
};

function collideWithBoxes(box, boxes) {
  return boxes.some(b => b.collidesWith(box));
}

function samplePositionFromBox(box) {
  const scale = 2;
  const randVec = Vec2.random(-scale, scale);
  const sizeVec = Vec2.of(box.width, box.height);
  return box.center.add(randVec.mul(sizeVec));
}

function generateSampleFromPivot(pivotEl, { tag, power }, results, k) {
  const pivotBox = Box.ofHtml(pivotEl);
  const boxes = Object.values(results).map(Box.ofHtml);
  const samples = [];
  for (let i = 0; i < k; i++) {
    const samplePosition = samplePositionFromBox(pivotBox);
    const translateVec = samplePosition.sub(pivotBox.center);
    const sampleBox = pivotBox.move(translateVec);
    const notCollideWithBoxes = !collideWithBoxes(sampleBox, boxes);
    const insideMainBox = MAIN_BOX.collidesWith(samplePosition);
    if (notCollideWithBoxes && insideMainBox) {
      samples.push(translateVec);
    }
  }
  averageDistFromBoxes = v =>
    boxes.reduce((e, b) => e + b.center.sub(v).length(), 0) / boxes.length;
  const maxSample = argmax(samples, averageDistFromBoxes);
  return maxSample
    ? createTagWithBox(tag, pivotBox.move(maxSample), power)
    : null;
}

function generateSample({ tag, power }) {
  return createTagWithPos(tag, MAIN_BOX.randomPointInside(), power);
}

function poissonDiskSample(priorityTagName, tagPower, k = 10) {
  const tagActiveList = [priorityTagName.shift()];
  const firstTag = tagActiveList[0];
  const resultsEl = {
    [firstTag]: generateSample({ tag: firstTag, power: tagPower(firstTag) })
  };
  let nextTag = priorityTagName.shift();
  while (tagActiveList.length > 0 && priorityTagName.length > 0) {
    const keys = Object.keys(resultsEl);
    const randomIndex = randomInt0(tagActiveList.length);
    const pivotEl =
      tagActiveList.length > 0
        ? resultsEl[tagActiveList[randomIndex]]
        : resultsEl[keys[randomInt0(keys.length)]];
    const sampleEl = generateSampleFromPivot(
      pivotEl,
      { tag: nextTag, power: tagPower(nextTag) },
      resultsEl,
      k
    );
    if (!sampleEl) {
      tagActiveList.length > 0 && tagActiveList.splice(randomIndex, 1);
    } else {
      resultsEl[nextTag] = sampleEl;
      tagActiveList.push(nextTag);
      nextTag = priorityTagName.shift();
    }
  }
  return resultsEl;
}

function randomSample(priorityTagName, tagPower) {
  while (priorityTagName.length > 0) {
    const tag = priorityTagName.shift();
    generateSample({ tag, power: tagPower(tag) });
  }
}

//========================================================================================
/*                                                                                      *
 *                                         Main                                         *
 *                                                                                      */
//========================================================================================

WebUtils.readDb().then(db => {
  const tagsH = WebUtils.getTagsHistogram(db);
  const sum = Object.values(tagsH).reduce((acc, v) => acc + v, 0);
  const prob = Object.keys(tagsH).map(t => tagsH[t] / sum);
  const min = prob.reduce((acc, x) => Math.min(acc, x), Number.MAX_VALUE);
  const max = prob.reduce((acc, x) => Math.max(acc, x), Number.MIN_VALUE);
  const priorityTagName = Object.entries(tagsH)
    .sort((a, b) => b[1] - a[1])
    .map(x => x[0]);
  const tagPower = t => (tagsH[t] / sum - min) / (max - min);
  poissonDiskSample(priorityTagName, tagPower);
  // randomSample(priorityTagName, tagPower);
  textFit(document.getElementsByClassName("badge"), {
    alignHoriz: true,
    alignVert: true
  });
});
