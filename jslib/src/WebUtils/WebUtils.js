import { Sort, ArrayUtils, EditDistance } from "nabla.js";
import { renderHtml } from "../Utils/Utils";
import { parse } from "nabladown.js/dist/Parser";
import { CodeRender } from "nabladown.js/dist/CodeRender";

const WebUtils = {};
/**
 *
 * @param {*} url
 * @param {*} htmlId
 * @param {*} mapLambda: String => String(in html)
 */
WebUtils.renderHtml = async (url, htmlComponent, mapLambda = text => text) => {
  console.log(`Reading from ${url}.. appending on ${htmlComponent.id}`);
  const text = await fetch(url).then(x => x.text());
  const child = renderHtml(mapLambda(text));
  htmlComponent.appendChild(child);
};

WebUtils.renderNablaDown = async (url, htmlComponent) => {
  console.log(
    `Reading from ${url} markdown.. appending on ${htmlComponent.id}`
  );
  const text = await fetch(url).then(x => x.text());
  htmlComponent.appendChild(render(parse(text)));
};

WebUtils.readDb = async () => {
  // const TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;
  // const time = new Date().getTime();
  // if (!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS) {
  //   console.log("retrieving db from cache");
  //   const dbJson = await fetch("resources/db/db.json").then(x => x.json());
  //   localStorage.db = JSON.stringify({ time: time, data: dbJson });
  // }
  // return JSON.parse(localStorage.db).data;
  return await fetch("resources/db/db.json").then(x => x.json());
};

WebUtils.sortDb = db => {
  return Sort.quicksort(
    db.posts,
    (a, b) => date2int(b.date) - date2int(a.date)
  );
};

WebUtils.randomDb = db => {
  return ArrayUtils.shuffle(db.posts);
};

WebUtils.getTagsHistogram = db =>
  db.posts
    .flatMap(p => p.tags)
    .reduce((hist, tag) => {
      if (!(tag in hist)) {
        hist[tag] = 1;
      } else {
        hist[tag] += 1;
      }
      return hist;
    }, {});

WebUtils.search = db => query => {
  if (!query || query.trim() === "") return [];
  const { distance: d } = EditDistance;
  const queryT = query.trim();
  const querySplit = queryT.split("+").map(s => s.trim());
  const tags = Object.keys(WebUtils.getTagsHistogram(db));
  const argMin = array => cost =>
    array.reduce(
      ([minC, minV], v) => {
        const c = cost(v);
        return c < minC ? [c, v] : [minC, minV];
      },
      [Number.MAX_VALUE, null]
    )[1];
  const qTagSet = querySplit
    .map(q => argMin(tags)(t => d(q, t.substring(0, q.length))))
    .reduce((s, v) => s.add(v), new Set());
  const score = searchScore(qTagSet);
  return db.posts
    .filter(p => p.tags.some(t => qTagSet.has(t)))
    .sort((a, b) => score(b) - score(a));
};

export default WebUtils;

//========================================================================================
/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

const searchScore = queryTagSet => post =>
  post.tags.reduce((acc, v) => (queryTagSet.has(v) ? acc + 1 : acc), 0);

function date2int(date) {
  const dateStrings = date.split("/");
  let acc = 0;
  let accM = 1;
  for (let j = 0; j < dateStrings.length; j++) {
    acc += parseFloat(dateStrings[j]) * accM;
    accM *= 100;
  }
  return acc;
}

/**
 *
 * @param {*} ast : nabladown.js abstract syntax tree
 */
function render(ast) {
  return new PRender().render(ast);
}

class PRender extends CodeRender {
  renderBlockCode(blockCode) {
    const { code, language } = blockCode;
    if (language.trim() === "") {
      const pre = document.createElement("pre");
      pre.innerHTML += code;
      return pre;
    }
    return super.getHighlightedCodeElem(code, language);
  }
}
