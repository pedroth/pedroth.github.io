import {
    readFileSync,
    readdirSync,
} from "fs";

function maybe(v) {
    if (!v) return {
        forEach: () => maybe(),
        orElse: lambda => lambda()
    };
    return {
        forEach: lambda => {
            lambda(v);
            return maybe(v);
        },
        orElse: () => v
    };
}

function prettifyTags(tags) {
    const sortedTags = tags.reduce((e, t) => {
        const n = t.length;
        if (!e[n]) e[n] = [];
        e[n].push(t);
        return e;
    }, {})
    let result = [];
    Object.keys(sortedTags)
        .forEach(k => {
            result = result.concat(sortedTags[k].sort());
        })
    return result;
}

function parseMeta(fileStr) {
    const split = fileStr.split("<!--");
    if (split.length === 1) return maybe();
    const metaStr = split[1].split("-->")[0];
    const postMeta = { title: "", creationDate: "", lastUpdateDate: "", tags: [] };
    try {
        const auxStack = [];
        metaStr
            .split(":")
            .flatMap(x => x.split("\n"))
            .flatMap(x => x.split(","))
            .forEach(str => {
                const trimmedStr = str.trim();
                maybe(auxStack.pop())
                    .forEach(key => {
                        if (key === "tags") {
                            auxStack.push("tags");
                            if ("[" === trimmedStr) return;
                            if ("]" === trimmedStr) auxStack.pop()
                            else maybe(trimmedStr).forEach(() => postMeta[key].push(trimmedStr));
                            return;
                        }
                        if (key in postMeta) {
                            postMeta[key] = trimmedStr;
                        }
                    })
                    .orElse(() => {
                        if (trimmedStr) {
                            auxStack.push(trimmedStr)
                        }
                    })
            })
    } catch (e) {
        return maybe();
    }
    return maybe(postMeta);
}

export default function buildPosts() {
    const baseFolder = "./posts/"
    const postFolders = readdirSync(
        baseFolder,
        { withFileTypes: true }
    )
        .filter(f => f.isDirectory());
    const postsMap = {};
    postFolders
        .forEach(folder => {
            const id = folder.name;
            const filePath = `./${baseFolder}/${id}/${id}.nd`;
            const ndFile = readFileSync(filePath, { encoding: "utf-8" });
            const maybeMeta = parseMeta(ndFile);
            maybeMeta.forEach(({ title, creationDate, lastUpdateDate, tags }) => {
                postsMap[id] = { id, title, creationDate, lastUpdateDate, tags: prettifyTags(tags) };
            })
        });
    return Object.values(postsMap).sort((a, b) => a.id < b.id ? -1 : a.id >= b.id ? 1 : 0);
}