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

  move(position) {
    return new Box(this.min.add(position), this.max.add(position));
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
 *                                  Poisson Disk Sample                                 *
 *                                                                                      */
//========================================================================================

const TITLE_HEIGHT = 175;
const MAIN_BOX = new Box(
  Vec2.of(window.innerHeight * 0.1, window.innerWidth * 0.1),
  Vec2.of(window.innerHeight * 0.9, window.innerWidth * 0.9)
);

const createTag = function (tag, { x, y }, power) {
  const fontSize = [window.innerWidth * 0.01, window.innerWidth * 0.02];
  const red = [1, 0, 0];
  const blue = [0, 0, 1];
  const color = blue
    .map(x => x * (1 - power))
    .map((x, i) => x + red[i] * power)
    .map(x => Math.floor(x * 255));
  const fontColor = color.map(x => 255);
  const tagEl = DomBuilder.of("a")
    .attr("class", "badge")
    .attr("href", `/?q=${tag}`)
    .attr(
      "style",
      `position: absolute; top:${x}px; left:${y}px; font-size:${fontSize[1]}px; background-color:rgb(${color[0]},${color[1]},${color[2]}); color:rgb(${fontColor[0]},${fontColor[1]},${fontColor[2]})`
    )
    .inner(tag)
    .build();
  DomBuilder.ofId("results").append(tagEl);
  return tagEl;
};

const argmax = (array, profit) =>
  array.reduce(
    (acc, v) => {
      const p = profit(v);
      return p > acc.p ? { p, v: v } : acc;
    },
    { p: Number.MIN_VALUE, v: null }
  ).v;

function collideWithBoxes(box, boxes) {
  console.log(
    "Boxes collide with box",
    boxes.map(b => b.collidesWith(box)),
    boxes.some(b => b.collidesWith(box))
  );
  return boxes.some(b => b.collidesWith(box));
}

function samplePositionFromBox(box) {
  return box.center.add(Vec2.random(-1, 1).mul(Vec2.of(box.height, box.width)));
}

function generateSampleFromPivot(pivotEl, { tag, power }, results, k) {
  const pivotBox = Box.ofHtml(pivotEl);
  const boxes = Object.values(results).map(Box.ofHtml);
  const samples = [];
  for (let i = 0; i < k; i++) {
    const samplePosition = samplePositionFromBox(pivotBox);
    const sampleBox = pivotBox.move(samplePosition);
    const notCollideWithBoxes = !collideWithBoxes(sampleBox, boxes);
    const insideMainBox = MAIN_BOX.collidesWith(samplePosition);
    if (notCollideWithBoxes && insideMainBox) {
      samples.push(samplePosition);
    }
  }
  console.log(
    `${pivotEl.innerText} -> ${tag} Number of samples`,
    samples.length
  );
  averageDistFromBoxes = v =>
    boxes.reduce((e, b) => e + b.center.sub(v).length(), 0) / boxes.length;
  const maxSample = argmax(samples, averageDistFromBoxes);
  return maxSample ? createTag(tag, maxSample, power) : null;
}

function generateSample({ tag, power }) {
  return createTag(tag, MAIN_BOX.randomPointInside(), power);
}

function poissonDiskSample(priorityTagName, tagPower, k = 10) {
  console.log("Start Poisson");
  const tagActiveList = [priorityTagName.shift()];
  const firstTag = tagActiveList[0];
  const resultsEl = {
    [firstTag]: generateSample({ tag: firstTag, power: tagPower(firstTag) })
  };
  while (tagActiveList.length > 0 && priorityTagName.length > 0) {
    const randomIndex = Math.floor(Math.random() * tagActiveList.length);
    const pivotEl = resultsEl[tagActiveList[randomIndex]];
    const nextTag = priorityTagName.shift();
    const sampleEl = generateSampleFromPivot(
      pivotEl,
      { tag: nextTag, power: tagPower(nextTag) },
      resultsEl,
      k
    );
    if (!sampleEl) delete tagActiveList[randomIndex];
    else {
      resultsEl[nextTag] = sampleEl;
      tagActiveList.push(nextTag);
    }
  }
  return resultsEl;
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
});
