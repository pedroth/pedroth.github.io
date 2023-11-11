import { memo } from "./Utils.js";

async function _getSvg(url) {
    const data = await fetch(url);
    return await data.text();
}

const getSvg = memo(_getSvg);

// (async () => {
//     await getSvg("/assets/dark_mode.svg");
//     await getSvg("/assets/light_mode.svg");
//     await getSvg("/assets/search.svg");
//     await getSvg("/assets/github.svg");
//     await getSvg("/assets/youtube.svg");
//     await getSvg("/assets/x-twitter.svg");
// })();

export default getSvg;
