import Database from "../Database.js";
import DOM from "../DomBuilder.js";
import getSvg from "../Svgs.js";
import { debounce, useState } from "../Utils.js";
import Card from "../components/Card.js";

function input(query, setQuery) {
    const inputDOM = DOM.of("input")
        .addClass("search-input")
        .attr("placeholder", "Search for tags or posts titles...")
        .attr("type", "text")
        .attr("value", query)
        .event(
            "keyup",
            e => {
                setQuery(() => e.target.value);
            }
        );
    const icon = DOM.of("span").inner(getSvg("/assets/search.svg"));
    setTimeout(() => {
        const inputElem = inputDOM.build();
        inputElem.setSelectionRange(query.length, query.length);
        inputElem.focus();
    }, 100);
    return DOM.of("label")
        .append(
            icon,
            inputDOM
        )
}

function searchPosts(posts, query) {
    if (query === "") return [];
    const finalQuery = query.toLowerCase();
    const results = posts
        .filter(
            p =>
                p.title.toLowerCase().includes(finalQuery) ||
                finalQuery.includes(p.title.toLowerCase()) ||
                p.tags.some(t => t.toLowerCase().includes(finalQuery) || finalQuery.includes(t.toLowerCase()) )
        )
        .map(p => Card(p));
    const paragraph = DOM.of("p").inner(`Found ${results.length} results for "${query}" :`);
    return [
        paragraph,
        DOM.of("paragraph")
            .addClass("posts-grid")
            .append(...results)
    ];
}

function getSearchedPosts(posts, query) {
    return DOM.of("div")
        .append(...searchPosts(posts, query));
}

function getSearchInGoogle(getQuery, onQueryChange) {
    const button = DOM.of("a")
        .addClass("center")
        .append(
            DOM.of("button")
                .addClass("button")
                .append(
                    DOM.of("h2").inner("Search in Google")
                )
        )
        .attr("href", `https://www.google.com/search?q=${encodeURI(`site:https://pedroth.github.io ${getQuery()}`)}`)
        .attr("target", `_blank`)
    const container = DOM.of("div")
        .addClass("center")
        .append(
            button
        )
    onQueryChange(newQuery =>
        button.attr(
            "href",
            `https://www.google.com/search?q=${encodeURI(`site:https://pedroth.github.io ${newQuery}`)}`
        )
    )
    return container;
}

export default async function search() {
    const posts = await Database.readSortedPosts();
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParam = urlParams.get("query");
    const [getQuery, setQuery, onQueryChange] = useState(queryParam || "");

    const inputElem = input(getQuery(), setQuery);
    const searchDiv = getSearchedPosts(posts, getQuery());
    onQueryChange((newQuery) => {
        searchDiv.removeChildren();
        searchDiv.append(
            ...searchPosts(posts, newQuery)
        );
    });
    onQueryChange(debounce(newQuery => {
        window.location.href = `?p=search#query=${newQuery}`
    }))
    return DOM.of("div")
        .addClass("search")
        .append(
            DOM.of("h1").inner("Search"),
            inputElem,
            searchDiv,
            DOM.of("hr"),
            getSearchInGoogle(getQuery, onQueryChange)
        );
}