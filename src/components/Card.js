import DomBuilder from "../DomBuilder.js"
import { formatDate } from "../Utils.js";

const Card = ({ id, title, lastUpdateDate, tags }) => {
    const url = `/?p=post/${id}`;
    const imageSrc = `posts/${id}/${id}_small.webp`;
    return DomBuilder.of("div")
        .addClass("card")
        .append(
            DomBuilder.of("a")
                .addClass("specialLink")
                .attr("href", url)
                .append(article({ imageSrc, title, lastUpdateDate, tags }))
        )
}

function article({ imageSrc, title, lastUpdateDate, tags }) {
    return DomBuilder.of("article")
        .append(cardImage({ imageSrc, title }))
        .append(cardBody({ title, lastUpdateDate, tags }))
}


function cardImage({ imageSrc, title }) {
    return DomBuilder.of("img")
        .attr("src", imageSrc)
        .attr("alt", title);
}

function cardBody({ title, lastUpdateDate }) {
    return DomBuilder.of("div")
        .append(
            DomBuilder.of("h3")
                .inner(title)
        )
        .append(
            DomBuilder.of("small")
                .inner(`Updated: ${formatDate(lastUpdateDate)}`)
        )
}

export default Card;