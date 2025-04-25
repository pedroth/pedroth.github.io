// eslint-disable-next-line no-undef
const build = await Bun.build({
    entrypoints: [
        "./src/imports.js",
    ],
    outdir: "./lib",
    minify: true,
    // target: "web",
    // sourcemap: "external",
    // splitting: true // not working
})
console.log(build);