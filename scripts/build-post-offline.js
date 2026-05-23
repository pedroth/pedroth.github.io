import { parse, renderToString } from "nabladown.js/dist/node/index.js";
import { writeFile, readFile } from "fs/promises";
import path from "path";

(async () => {
    const folderArg = process.argv[2];
    if (!folderArg) {
        console.error("Usage: node build-post-offline.js <folder>");
        process.exit(1);
    }
    const folderPath = path.resolve(folderArg);
    const folderName = path.basename(folderPath);
    const ndFile = path.join(folderPath, `${folderName}.nd`);
    const text = await readFile(ndFile, "utf-8");
    const content = await renderToString(parse(text));
    await writeFile(path.join(folderPath, "index.html"), content);
    console.log(`Written: ${path.join(folderPath, "index.html")}`);
})();