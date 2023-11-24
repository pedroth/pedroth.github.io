import { date2int, shuffle } from "./Utils.js";

let database = undefined;
const Database = {};

Database.read = async () => {
    if (!database) {
        database = await fetch("/database/db.json").then(x => x.json());
    }
    return database;
};

Database.readPostsAsMap = async () => {
    if (!database) await Database.read();
    if (!database.postsMap) {
        Database.postsMap = database.posts.reduce((acc, post) => {
            acc[post.id] = post; return acc;
        }, {});
    }
    return Database.postsMap;
};

Database.readSortedPosts = async () => {
    if (!database) await Database.read();
    const posts = [...database.posts];
    return posts.sort((a, b) => date2int(b.lastUpdateDate) - date2int(a.lastUpdateDate));
};

Database.readRandomPosts = async () => {
    if (!database) await Database.read();
    return shuffle(database.posts);
}

export default Database;