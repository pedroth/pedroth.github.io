function quote(input) {
    return `<div class="quote">${input}</div>`;
}

function c(input, args) {
    return `<div class="${args.join(" ")}">${input}</div>`;
}
MACROS = { c, quote }