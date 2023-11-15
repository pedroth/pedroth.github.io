//========================================================================================
/*                                                                                      *
 *                                         TODO                                         *
 *                                                                                      */
//========================================================================================

// import {
//     readFileSync,
//     writeFileSync
// } from "fs";

// function readMetaDataFromPostId(id) {
//     let file = readFileSync(`/posts/${id}/${id}.nd`);
//     file = file.replaceAll("-->", "<!--");
//     const split = file.split("<!--");
//     if (split.length > 3) {

//     }
//     return;
// }

// (() => {
//     const posts = {};
//     getAllPostFolders().forEach((id) => {
//         const metadata = readMetaDataFromPostId(id);
//         if (!metadata) return;
//         const { title, tags, creationDate, lastUpdate } = metadata;
//         const sortedTags = prettifyTags(tags)
//         posts[id] = { id, title, date: creationDate, lastUpdate: lastUpdate, tags: sortedTags };
//     })
//     writeFileSync(`./database/db.json`, JSON.stringify({ posts: Object.values(posts) }))
// })()

// function prettifyTags(tags) {
//     const sortedTags = tags.reduce((e, t) => {
//         const n = t.length;
//         if (!e[n]) e[n] = [];
//         e[n].push(t);
//         return e;
//     }, {})
//     let result = [];
//     Object.keys(sortedTags).forEach(k => {
//         result = result.concat(sortedTags[k].sort());
//     })
//     return result;
// }

// (() => {
//     const db = JSON.parse(readFileSync("./database/db.json"));
//     db.posts.forEach(p =>  {
//         p.tags = prettifyTags(p.tags);
//     })
//     writeFileSync(`./database/db.json`, JSON.stringify(db, null, 3))
// })()