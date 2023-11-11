import Database from "../Database.js";
import DOM from "../DomBuilder.js";
import Card from "../components/Card.js";

function getCardGrid(posts) {
    return DOM.of("div")
        .addClass("posts-grid")
        .append(...posts.map(p => Card(p)));
}

export default async function posts() {
    const posts = await Database.readSortedPosts();
    return DOM.of("div")
        .append(
            DOM.of("h1")
                .inner("Posts"),
            getCardGrid(posts)
        );
}