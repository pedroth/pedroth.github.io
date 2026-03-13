function quote(input) {
    return `<div class="quote">${input}</div>`;
}
function split(input) {
    return `<div style="display: flex; gap: 1rem;">${input}</div>`;
}
MACROS = { quote, split }