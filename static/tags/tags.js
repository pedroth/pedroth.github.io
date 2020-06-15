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
    return new Vec2(...this.toArray().reduce(foldLambda, acc));
  }

  bimap(vec2, biLambda) {
    const v = vec2.toArray();
    return new Vec2(...this.toArray().map((x, i) => biLambda(x, v[i])));
  }

  sum(vec2) {
    return this.bimap(vec2, (a, b) => a + b);
  }

  add(vec2) {
    return this.sum(vec2);
  }

  sub(vec2) {
    return this.bimap(vec2, (a, b) => a - b);
  }

  mul(vec2) {
    return this.bimap(vec2, (a, b) => a * b);
  }

  div(vec2) {
    return this.bimap(vec2, (a, b) => a / b);
  }

  dot(vec2) {
    return this.mul(vec2).reduce((acc, x) => acc + x, 0);
  }

  scale(r) {
    return this.map(x => x * r);
  }

  static random() {
    return new Vec2(...[1, 2].map(() => Math.random()));
  }

  static of(x, y) {
    return new Vec2(x, y);
  }

  static fromArray([x, y]) {
    return new Vec2(x, y);
  }

  static ZERO() {
    return new Vec2(0, 0);
  }
}

class Box {
  constructor(min, max) {
    this.min = min.bimap(max, Math.min);
    this.max = max.bimap(min, Math.max);
    this.center = min.add(max).scale(1 / 2);
  }

  add(box) {
    const { min, max } = this;
    return new Box(min.bimap(box.min, Math.min), max.bimap(box.max, Math.max));
  }

  sub(box) {
    const { min, max } = this;
    return new Box(min.bimap(box.min, Math.max), max.bimap(box.max, Math.min));
  }

  static ZERO() {
    return new Box(Vec2.ZERO(), Vec2.ZERO());
  }

  static ofHtml(elem) {
    const box = elem.getBoundingClientRect();
    const corner = Vec2.of(box.top, box.left);
    return new Box(corner, corner.add(Vec2.of(box.height, box.width)));
  }
}

class SpatialTree {
  constructor() {
    this.tree = { box: Box.ZERO(), children: [] };
  }

  node(box) {
    return { box: box, children: [] };
  }

  push(box, tree = this.tree) {
    if (tree.children.length < 2) {
      tree.children.push(this.node(box));
    } else {
    }
    return this;
  }
}

const createTag = function (tag, [x, y], power) {
  const fontSize = [window.innerWidth * 0.02, window.innerWidth * 0.04];
  const red = [1, 0, 0];
  const blue = [0, 0, 1];
  const color = blue
    .map(x => x * (1 - power))
    .map((x, i) => x + red[i] * power)
    .map(x => Math.floor(x * 255));
  const fontColor = color.map(x => 255);
  return DomBuilder.of("a")
    .attr("class", "badge")
    .attr("href", `/?q=${tag}`)
    .attr(
      "style",
      `position: absolute; top:${x}px; left:${y}px; font-size:${
        fontSize[0] * (1 - power) + fontSize[1] * power
      }px; background-color:rgb(${color[0]},${color[1]},${
        color[2]
      }); color:rgb(${fontColor[0]},${fontColor[1]},${fontColor[2]})`
    )
    .inner(tag)
    .build();
};

function generateFirstSample() {
  const h = 175;
  const H = window.innerHeight;
  const W = window.innerWidth;
  return Vec2.of(h, 0).add(Vec2.random().mul(H - h, W));
}

const argmax = array => profit =>
  array.reduce(
    (acc, v) => {
      const p = profit(v);
      return p > acc.p ? { p, v: v } : acc;
    },
    { p: Number.MIN_VALUE, v: null }
  ).v;

function collideWithBoxes(pos, boxes) {}

function generateSampleFromPivot(pivotEl, { tag, power }, results, k = 4) {
  const box = Box.ofHtml(pivotEl);
  const boxes = Object.values(results).map(Box.ofHtml);
  const samples = [];
  for (let i = 0; i < k; i++) {
    const pos = sampleFromBox(box);
    if (!collideWithBoxes(pos, boxes)) {
      samples.push(pos);
    }
  }
  const maxSample = argmax(samples, v => v.dot(v));
  return maxSample ? createTag(tag, maxSample, power) : null;
}

WebUtils.readDb().then(db => {
  const tagsH = WebUtils.getTagsHistogram(db);
  const sum = Object.values(tagsH).reduce((acc, v) => acc + v, 0);
  const prob = Object.keys(tagsH).map(t => tagsH[t] / sum);
  const min = prob.reduce((acc, x) => Math.min(acc, x), Number.MAX_VALUE);
  const max = prob.reduce((acc, x) => Math.max(acc, x), Number.MIN_VALUE);
  const priority = Object.entries(tagsH)
    .sort((a, b) => b[1] - a[1])
    .map(x => x[0]);
  const power = t => (tagsH[t] / sum - min) / (max - min);

  const k = 4;
  const sampleStack = [priority.shift()];
  const firstTag = sampleStack[0];
  const results = {
    [firstTag]: createTag(firstTag, generateFirstSample(), power(firstTag))
  };
  while (sampleStack.length > 0) {
    const randomIndex = Math.floor(Math.random() * sampleStack.length);
    const pivotEl = results[sampleStack[randomIndex]];
    const nextTag = priority.shift();
    const sampleEl = generateSampleFromPivot(
      pivotEl,
      { tag: nextTag, power: power },
      results,
      k
    );
    if (!sampleEl) delete sampleStack[randomIndex];
    else {
      results[nextTag] = sampleStack;
      sampleStack.push(nextTag);
    }
  }
  DomBuilder.ofId("results").append(results);
});
