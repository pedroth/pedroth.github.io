function quote(input) {
    return `<div class="quote">${input}</div>`;
}
function split(input) {
    return `<div style="display: flex; gap: 1rem;">${input}</div>`;
}

function grid(input) {
    return `
        <div class="macro-grid" style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        ">
            <style>
                /* Remove empty paragraphs completely from grid calculations */
                .macro-grid > p:empty,
                .macro-grid > p:has(span:empty) {
                    display: none !important;
                }
                .macro-grid video {
                    width: 100%;
                    height: auto;
                }
            </style>
            ${input}
        </div>
    `;
}

function details(input, args) {
    return `
    <details style="margin-left: 1rem;">
    <summary style="font-weight: bold; cursor: pointer;">${args[0]}</summary>
    <div style="margin-left: 1rem;">${input}</div>
    </details>
    `;
}

function scaleDiv(nabla, args) {
    const [scalePercentage, heightPercentage] = args;
    return `<div style="width:${scalePercentage}%; height: ${heightPercentage ?? 100}%; margin-left: auto; margin-right: auto;">${nabla}</div>`;
}

// read links in the format [title](url) and return a div with buttons for each link
function linkButtons(links, _) {
    const linksArray = links.split("\n");
    const regex = /\[(.+)\]\((.+)\)/;
    const buttonsStrings = [];
    linksArray.map(link => {
        const match = link.match(regex);
        if (match) {
            const [_, text, url] = match;
            buttonsStrings.push(`
                <a href="${url}" target="_blank" style="align-self: center; margin: 20px">
                <button class="button"><p>${text}</p></button>
                </a>`
            );
        }
    });
    return `<div style="display: flex; flex-direction: column;">${buttonsStrings.join("")}</div>`;
}

MACROS = { quote, split, grid, details, scaleDiv, linkButtons };