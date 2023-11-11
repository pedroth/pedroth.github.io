import DomBuilder from "../DomBuilder.js"
import { formatDate } from "../Utils.js";

const Card = ({ id, title, lastUpdate, tags }) => {
    const url = `/?p=post/${id}`;
    const imageSrc = `posts/${id}/${id}_small.webp`;
    return DomBuilder.of("div")
        .addClass("card")
        .append(
            DomBuilder.of("a")
                .addClass("specialLink")
                .attr("href", url)
                .append(article({ imageSrc, title, lastUpdate, tags }))
        )
}

function article({ imageSrc, title, lastUpdate, tags }) {
    return DomBuilder.of("article")
        .append(cardImage({ imageSrc, title }))
        .append(cardBody({ title, lastUpdate, tags }))
}


function cardImage({ imageSrc, title }) {
    return DomBuilder.of("img")
        .attr("src", imageSrc)
        .attr("alt", title);
}

function cardBody({ title, lastUpdate }) {
    return DomBuilder.of("div")
        .append(
            DomBuilder.of("h3")
                .inner(title)
        )
        .append(
            DomBuilder.of("small")
                .inner(`Updated: ${formatDate(lastUpdate)}`)
        )
}

export default Card;