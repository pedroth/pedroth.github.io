function quote(input) {
    return `<div class="quote">${input}</div>`;
}
function split(input) {
    return `<div style="display: flex; gap: 1rem;">${input}</div>`;
}

function details(input, args) {
    console.log("Details macro", args);
    return `
    <details style="margin-left: 1rem;">
    <summary style="font-weight: bold; cursor: pointer;">${args[0]}</summary>
    <div style="margin-left: 1rem;">${input}</div>
    </details>
    `;
}

function scaleDiv(nablaImg, args) {
    const [scalePercentage, heightPercentage] = args;
    return `<div style="width:${scalePercentage}%; height: ${heightPercentage ?? 100}%; margin-left: auto; margin-right: auto;">${nablaImg}</div>`;
}

MACROS = { quote, split, details, scaleDiv };