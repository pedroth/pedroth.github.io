import Card from "../Card/Card";

export function addResizeObservers(window) {
  window.sizeObservers = [];
  function onResize() {
    window.sizeObservers.forEach(obs => {
      obs();
    });
  }
  window.addEventListener("resize", onResize);
}

//========================================================================================
/*                                                                                      *
 *                                      CARDS GRID                                      *
 *                                                                                      */
//========================================================================================

export function getRowReSize(rowDiv) {
  return () => {
    if (window.innerWidth >= window.innerHeight) {
      const n = rowDiv.childNodes.length;
      const w = window.innerWidth / n;
      rowDiv.style["flex-direction"] = "row";
      rowDiv.childNodes.forEach(child => {
        child.style.width = `${w}px`;
        child.style["max-width"] = `100%`;
      });
    } else {
      rowDiv.style["flex-direction"] = "column";
      rowDiv.style["align-items"] = "center";
      const w = window.innerWidth * 0.77;
      rowDiv.childNodes.forEach(child => (child.style.width = `${w}px`));
    }
  };
}

export function getCardsInRow(posts, colPerRows) {
  const row = DomBuilder.of("div").attr(
    "style",
    "display: flex; max-width: 100%"
  );
  for (let i = 0; i < colPerRows; i++) {
    const post = posts[i];
    const col = DomBuilder.of("div")
      .attr("style", "margin: 10px;")
      .append(
        Card.builder()
          .imageSrc(`${post.src}/${post.id}.webp`)
          .url(`/?p=${post.src}/${post.id}.nd`)
          .title(post.title)
          .tags(post.tags)
          .date(post.date)
          .build()
      )
      .build();
    row.append(col);
  }
  const rowDiv = row.build();
  const rowResize = getRowReSize(rowDiv);
  window.sizeObservers.push(rowResize);
  rowResize();
  return rowDiv;
}

export const getCardGrid = (posts, k = 3) => {
  const body = DomBuilder.of("div");
  const n = Math.floor(posts.length / k);
  for (let i = 0; i < n; i++) {
    const row = getCardsInRow(posts.splice(0, k), k);
    body.append(row);
  }
  const remainder = posts.splice(0, k);
  body.append(getCardsInRow(remainder, remainder.length));
  return body.build();
};

//========================================================================================
/*                                                                                      *
 *                                         RENDER HTML                                  *
 *                                                                                      */
//========================================================================================

export function renderHtml(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  const scripts = Array.from(div.getElementsByTagName("script"));
  const asyncLambdas = scripts.map(script => () => evalScriptTag(script));
  asyncForEach(asyncLambdas);
  return div;
}

function evalScriptTag(scriptTag) {
  const globalEval = eval;
  const srcUrl = scriptTag?.attributes["src"]?.textContent;
  if (!!srcUrl) {
    return fetch(srcUrl)
      .then(code => code.text())
      .then(code => {
        globalEval(code);
      });
  } else {
    return new Promise((re, _) => {
      globalEval(scriptTag.innerText);
      re(true);
    });
  }
}

async function asyncForEach(asyncLambdas) {
  for (const asyncLambda of asyncLambdas) {
    await asyncLambda();
  }
}
