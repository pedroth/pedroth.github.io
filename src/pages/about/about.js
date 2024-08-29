import DOM from "../../DomBuilder.js";
import renderFromString from "../../PedroDown.js";

const ABOUT_PATH = '/src/pages/about/about.nd';
export default async function about() {
    const aboutFile = await fetch(ABOUT_PATH).then(f => f.text());
    return DOM.of("div")
        .append(renderFromString(aboutFile));
}