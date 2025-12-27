import { writeFile, readFile, stat } from "fs/promises";
import RSS from "rss";
import { date2int } from "../src/Utils.js";

const HOME = "https://pedroth.github.io";
const FEED_URL = `${HOME}/feed/rss.xml`;

function parseDateUTC(dateString) {
    // expected format: DD/MM/YYYY
    const [day, month, year] = dateString.split("/").map(Number);
    if (day && month && year) {
        return new Date(Date.UTC(year, month - 1, day));
    }
    return new Date();
}

export default async () => {
    const { posts } = JSON.parse(
        await readFile("./database/db.json", "utf-8")
    );

    // newest first
    const sortedPosts = posts.sort(
        (a, b) => date2int(b.lastUpdateDate) - date2int(a.lastUpdateDate)
    );

    const feed = new RSS({
        title: "Pedroth's Corner",
        description: "Pedroth's Corner: Maths. Computer Science. Philosophy",
        feed_url: FEED_URL,        // MUST match actual feed URL
        site_url: HOME,
        language: "en-US",
        generator: "Pedroth RSS Generator"
    });

    for (const { title, id, lastUpdateDate } of sortedPosts) {
        const imagePath = `./posts/${id}/${id}_small.webp`;
        const imageUrl = `${HOME}/posts/${id}/${id}_small.webp`;

        let enclosure;
        try {
            const { size } = await stat(imagePath);
            enclosure = {
                url: imageUrl,
                type: "image/webp",
                length: size
            };
        } catch {
            enclosure = undefined;
        }

        feed.item({
            title,
            description: `Demo and notes about ${title}.`,
            url: `${HOME}/?p=post/${id}/${id}.nd`,
            guid: `${HOME}/?p=post/${id}/${id}.nd`,
            date: parseDateUTC(lastUpdateDate),
            author: "Pedroth",
            enclosure
        });
    }

    await writeFile("./feed/rss.xml", feed.xml({ indent: true }));
};
