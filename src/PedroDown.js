import DOM from "./DomBuilder.js";

function generateUniqueID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let randomID = '';
    const randomBytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(randomBytes);
    for (let i = 0; i < length; i++) {
        randomID += characters[randomBytes[i] % charactersLength];
    }
    return randomID;
}

export function createPedrothRender(Render, buildDom) {
    class PedrothRender extends Render {
        renderBlockCode(blockCode, context) {
            const { code, language } = blockCode;
            const split = language.split("*");
            if (split.length === 1)
                return super.renderBlockCode(blockCode, context);

            const container = super.renderBlockCode({ code, language: split[0] }, context);
            const evaluator = () => {
                let evaluation;
                try {
                    evaluation = eval(code);
                } catch (e) {
                    evaluation = e.message;
                }
                return JSON.stringify(evaluation, null, 2);
            }
            const uid = generateUniqueID(10);
            const resultBlockBuilder = () => super
                .renderBlockCode({
                    code: evaluator(),
                    language: "js"
                }, context)
            const result = buildDom("div")
                .appendChild(
                    buildDom("div")
                        .attr("style", "padding: 0 1.5em")
                        .attr("id", uid)
                        .appendChild(resultBlockBuilder()),
                )
            if (code.includes("Math.random()")) {
                result.appendChild(
                    buildDom("button")
                        .attr("class", "button")
                        .attr("style", "position: absolute; bottom: 0; right: 1.5em;")
                        .inner("replay")
                        .event("click", async () => {
                            DOM.ofId(uid)
                                .removeChildren()
                                .append(
                                    resultBlockBuilder()
                                        .build()
                                )
                        })
                );
            }
            container.appendChild(result);
            return container;
        }
    }
    return PedrothRender;
}

export default async function renderFromString(str) {
    // Lazy-load markdown parser only when needed (post pages)
    const { parse, Render, buildDom } = await import("../lib/importsND.js");
    const PedrothRender = createPedrothRender(Render, buildDom);
    const parsed = parse(str);
    return await (new PedrothRender().render(parsed));
}

export async function renderOfflineHTML(str) {
    const { parse, Render, buildDom } = await import("nabladown.js/dist/node/index.js");
    const PedrothRender = createPedrothRender(Render, buildDom);
    class OfflineRender extends PedrothRender {
        renderBlockCode(blockCode, context) {
            const { code, language } = blockCode;
            const split = language.split("*");
            if (split.length === 1) return super.renderBlockCode(blockCode, context);
            // Skip eval at build time — render as plain code block
            return super.renderBlockCode({ code, language: split[0] }, context);
        }
    }
    const parsed = parse(str);
    return await new OfflineRender().abstractRender(parsed).then(doc => doc.toString());
}
