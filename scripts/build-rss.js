
import { writeFile, readFile } from "fs/promises";
import { default as RSS } from "rss";
import { date2int } from "../src/Utils.js";

const HOME = `https://pedroth.github.io`

function parseDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-based (0 = January, 1 = February, ...)
        const year = parseInt(parts[2]);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }

    return new Date();
}

export default async () => {
    const { posts } = JSON.parse(await readFile("./database/db.json", "utf-8"));
    const sortedPosts = posts.sort((a, b) => date2int(a.lastUpdateDate) - date2int(b.lastUpdateDate));
    const feed = new RSS({
        title: `Pedroth's Corner`,
        description: `Pedroth's Corner: Maths.Computer Science.Philosophy`,
        feed_url: `${HOME}/feed/rss.xml`,
        site_url: HOME,
        language: 'en-us'
    });
    sortedPosts.forEach(({ title, id, lastUpdateDate }) => {
        feed.item({
            title,
            description: title,
            url: `${HOME}/?p=post/${id}/${id}.nd`,
            date: parseDate(lastUpdateDate),
            author: "Pedroth",
            enclosure: {
                url: `${HOME}/posts/${id}/${id}_small.webp`, // URL of the image
                type: 'image/webp', // Mime type of the image
            }
        });
    })

    // Generate the XML content of the feed
    const xml = feed.xml();

    // Write the XML content to a file
    writeFile('./feed/rss.xml', xml);
}