// eslint-disable-next-line no-undef
const build = await Bun.build({
    entrypoints: [
        "./src/imports.js",
        "./src/importsND.js",
    ],
    outdir: "./lib",
    minify: true,
    splitting: true,
})
console.log(build);