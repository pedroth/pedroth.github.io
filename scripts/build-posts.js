//========================================================================================
/*                                                                                      *
 *                                         TODO                                         *
 *                                                                                      */
//========================================================================================

// import {
//     readFileSync,
//     readdirSync,
//     statSync,
//     writeFileSync,
// } from "fs";

// function parseDate(dateString) {
//     try {
//         const parts = dateString.split('T')[0].split("-");
//         if (parts.length === 3) {
//             const day = parseInt(parts[2]);
//             const month = parseInt(parts[1]);
//             const year = parseInt(parts[0]);

//             if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
//                 return `${day}/${month}/${year}`;
//             }
//         }
//         throw new Error("Invalid date");
//     } catch (e) {
//         console.error("Invalid date", e);
//     }
// }

// export async function updateDates() {
//     const baseFolder = "./posts/"
//     const folders = readdirSync(baseFolder, { withFileTypes: true }).filter(f => f.isDirectory());
//     const db = JSON.parse(readFileSync("./database/db.json"));
//     folders.forEach(async folder => {
//         const filePath = `./${baseFolder}/${folder.name}/${folder.name}.nd`;
//         const stats = statSync(filePath);
//         const lastModifiedDate = parseDate(stats.mtime.toISOString());
//         db.posts.filter(post => post.id === folder.name)[0].lastUpdate = lastModifiedDate;
//         // console.log(">>>0", lastModifiedDate);
//     })
//     writeFileSync("./database/db.json", JSON.stringify(db, null, 3));
// }

// (() => updateDates())()


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

// // sort tags by length and alphabetical order
// (() => {
//     const db = JSON.parse(readFileSync("./database/db.json"));
//     db.posts.forEach(p =>  {
//         p.tags = prettifyTags(p.tags);
//     })
//     writeFileSync(`./database/db.json`, JSON.stringify(db, null, 3))
// })()