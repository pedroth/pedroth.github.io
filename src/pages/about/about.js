import DOM from "../../DomBuilder.js";
import renderFromString from "../../PedroDown.js";
import { str2dom } from "../../Utils.js";

const ABOUT_PATH_ND = '/src/pages/about/about.nd';
const ABOUT_PATH_HTML = '/src/pages/about/index.html';
export default async function about() {
    const htmlRes = await fetch(ABOUT_PATH_HTML);
    let postContent = undefined;
    if (htmlRes.ok) {
        const html = await htmlRes.text();
        postContent = str2dom(`${html}`);
    } else {
        const aboutFile = await fetch(ABOUT_PATH_ND).then(f => f.text());
        postContent = await renderFromString(aboutFile);
    }
    return DOM.of("div").append(postContent);
}