import Database from "../Database.js";
import DomBuilder from "../DomBuilder.js";
import Card from "../components/Card.js";

function cardsInRow(posts, k = 3) {
    return DomBuilder.of("div")
        .addClass("cardsRow")
        .append(...posts.slice(0, k)
            .map(p => Card(p)))
}

function presentation() {
    return DomBuilder.of("div")
        .addClass("presentation")
        .append(
            DomBuilder.of("h1")
                .inner("Pedroth's corner"),
            DomBuilder.of("h2")
                .inner("Math.Computer Science.Philosophy")
        )
}

async function recentPosts() {
    const posts = await Database.readSortedPosts()
    return DomBuilder.of("div")
        .addClass("recentPosts")
        .append(
            DomBuilder.of("h2")
                .inner("Recent posts"),
            DomBuilder.of("hr"),
            cardsInRow(posts)
        );
}

async function randomPosts() {
    const posts = await Database.readRandomPosts();
    return DomBuilder.of("div")
        .addClass("randomPosts")
        .append(
            DomBuilder.of("h2")
                .inner("Random posts"),
            DomBuilder.of("hr"),
            cardsInRow(posts)
        );
}

export default async function main() {
    return DomBuilder.of("main")
        .append(presentation())
        .append(await recentPosts())
        .append(await randomPosts());
}