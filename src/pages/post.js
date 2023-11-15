import Database from "../Database.js";
import DOM from "../DomBuilder.js";
import renderFromString from "../PedroDown.js";
import { formatDate, str2dom } from "../Utils.js";


function notFound(page) {
    // TODO: think of adding a small game, simulation here...
    return DOM.of("p").style("margin-bottom: 10rem").inner(`Sorry but we didn't found the page, ${page}...`);
}

function renderTags(tags) {
    return DOM.of("div").append(
        DOM.of("h3").inner("Tags"),
        DOM.of("div")
            .addClass("flex wrap center")
            .append(...tags.map(tag => {
                return DOM.of("a")
                    .addClass("badge")
                    .attr("title", tag)
                    .style(`
                background-color: var(--primary-color);
                color: white;
                font-size: 1em;
                margin: 0.25em 0.5em;
                padding: 0.25em 0.5em;
                text-decoration: none;
            `)
                    .attr("href", `/?p=search#query=${tag}`)
                    .inner(tag);
            })),
    );
}

function renderPostHeader(post) {
    const { title, lastUpdate, date } = post;
    return DOM.of("div")
        .append(
            // DOM.of("div")
            //     .addClass("center")
            //     .append(
            //         DOM.of("img")
            //             .style("max-width: 100%; border-radius:0.25rem;")
            //             .attr("src", `/posts/${id}/${id}.webp`)
            //     ),
            DOM.of("h1").inner(`${title}`),
            DOM.of("div")
                .addClass("flex level")
                .append(
                    DOM.of("small")
                        .addClass("grow")
                        .inner(`Created: ${formatDate(date)}`),
                    DOM.of("small")
                        .inner(`Updated: ${formatDate(lastUpdate)}`),
                ),
            DOM.of("hr")
        );
}

function renderComments() {
    return str2dom(`
    <details>
    <summary>Open/Close comments</summary>
    <!-- begin wwww.htmlcommentbox.com -->
    <div id="HCB_comment_box" class="bound" style="padding:0 3em;">
      <a href="http://www.htmlcommentbox.com">Comment Form</a> is loading
      comments...
    </div>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://www.htmlcommentbox.com/static/skins/bootstrap/twitter-bootstrap.css?v=0"
    />
    <script type="text/javascript" id="hcb">
      /*<!--*/ if (!window.hcb_user) {
        hcb_user = {};
      }
      (function () {
        var s = document.createElement("script"),
          l = hcb_user.PAGE || ("" + window.location).replace(/'/g, "%27"),
          h = "https://www.htmlcommentbox.com";
        s.setAttribute("type", "text/javascript");
        s.setAttribute(
          "src",
          h +
            "/jread?page=" +
            encodeURIComponent(l).replace("+", "%2B") +
            "&mod=%241%24wq1rdBcg%24iPBjIjl5Snl95PPcGQ7YG%2F" +
            "&opts=16862&num=10&ts=1619287827621"
        );
        if (typeof s != "undefined")
          document.getElementsByTagName("head")[0].appendChild(s);
      })(); /*-->*/
    </script>
    <!-- end www.htmlcommentbox.com -->
  </details>
    `);
}

function renderPostFooter(post) {
    const { tags } = post;
    return [
        DOM.of("hr"),
        renderTags(tags),
        DOM.of("hr"),
        renderComments()
    ];
}

export default async function post(page) {
    const split = page.split("/");
    if (split.length === 0) return notFound(page);
    const id = split[1];
    const postsMap = await Database.readPostsAsMap();
    if (!(id in postsMap)) return notFound(page);
    const post = postsMap[id];
    const content = await fetch(`/posts/${id}/${id}.nd`).then(x => x.text());
    return DOM.of("div")
        .append(
            renderPostHeader(post),
            await renderFromString(content),
            ...renderPostFooter(post),
        );
}