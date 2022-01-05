import { Sort, ArrayUtils, EditDistance } from "nabla.js";
import { renderHtml } from "../Utils/Utils";
import { parse } from "nabladown.js/dist/Parser";
import { Render } from "nabladown.js/dist/NabladownRender";

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
    .map(tag => tag.toLowerCase())
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
  const tagsHist = WebUtils.getTagsHistogram(db);
  const { distance: editDistance } = Nabla.EditDistance;
  const queryT = query.toLowerCase().trim();
  debugger;
  let searchPosts = [];
  if (queryT in tagsHist) {
    searchPosts = db.posts
      .filter(p => p.tags.some(t => t.toLowerCase() === queryT))
      .sort((a, b) => date2int(b.date) - date2int(a.date));
  }
  if (searchPosts.length === 0) {
    searchPosts = db.posts.filter(p =>
      p.title.toLowerCase().trim().includes(queryT)
    );
  }
  if (searchPosts.length === 0) {
    searchPosts = [...db.posts]
      .sort(
        (a, b) =>
          editDistance(
            a.title.toLowerCase().substring(0, queryT.length),
            queryT
          ) -
          editDistance(
            b.title.toLowerCase().substring(0, queryT.length),
            queryT
          )
      )
      .splice(0, 5);
  }
  return searchPosts;
};

export default WebUtils;

//========================================================================================
/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

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

class PRender extends Render {
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
