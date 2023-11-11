import Database from "../Database.js";
import DOM from "../DomBuilder.js";
import renderFromString from "../PedroDown.js";
import { formatDate } from "../Utils.js";


function notFound(page) {
    // TODO: think of adding a small game, simulation here...
    return DOM.of("p").style("margin-bottom: 10rem").inner(`Sorry but we didn't found the page, ${page}...`);
}

function renderTags(tags) {
    // const modal = DOM.of("dialog")
    //     .append(
    //         DOM.of("div")
    //             .append(
    //                 DOM.of("h3").inner("Tags"),
    //                 DOM.of("div")
    //                     .addClass("posts-grid")
    //                     .append(...tags.map(tag => {
    //                         return DOM.of("a")
    //                             .addClass("badge")
    //                             .attr("title", tag)
    //                             .style(`
    //                         background-color: var(--primary-color);
    //                         color: white;
    //                         font-size: 1em;
    //                         text-decoration: none;
    //                     `)
    //                             .attr("href", `/?p=search#query=${tag}`)
    //                             .inner(tag);
    //                     })),
    //             )
    //     )
    // // From https://stackoverflow.com/questions/25864259/how-to-close-the-new-html-dialog-tag-by-clicking-on-its-backdrop
    // modal.event("click", (event) => {
    //     const rect = modal.element.getBoundingClientRect();
    //     const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
    //         rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    //     if (!isInDialog) {
    //         modal.element.close();
    //     }
    // })
    // return DOM.of("div")
    //     .append(
    //         modal,
    //         DOM.of("button")
    //             .addClass("button")
    //             .inner("Tags")
    //             .event("click", () => {
    //                 modal.element.showModal();
    //             })
    //     )

    return DOM.of("div").append(
        DOM.of("h3").inner("Tags"),
        DOM.of("div")
            .addClass("flex wrap")
            .append(...tags.map(tag => {
                return DOM.of("a")
                    .addClass("badge")
                    .attr("title", tag)
                    .style(`
                background-color: var(--primary-color);
                color: white;
                font-size: 1em;
                margin: 0 0.1em;
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

function renderPostFooter(post) {
    const { tags } = post;
    return [
        DOM.of("hr").style("margin-top: 7rem;"),
        renderTags(tags)
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