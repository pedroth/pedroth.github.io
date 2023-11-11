import { parse, Render } from "../lib/imports.js"

export default function renderFromString(str) {
    return new PedrothRender().render(parse(str));
}

class PedrothRender extends Render {
}