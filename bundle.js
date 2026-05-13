// eslint-disable-next-line no-undef
const build = await Bun.build({
    entrypoints: [
        "./src/importsMarkdown.js", // split chunk for nabladown
    ],
    outdir: "./lib",
    minify: true,
    splitting: true,
    // target: "web",
    // sourcemap: "external",
})
console.log(build);