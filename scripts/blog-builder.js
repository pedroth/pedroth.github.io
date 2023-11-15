import { writeFile, readFile } from "fs/promises";
import { default as RSS } from "rss";
import { Command } from "commander";
import { date2int } from "../src/Utils.js";
import { buildJavaPosts } from "./build-java.js";

const HOME = `https://pedroth.github.io`

function parseDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-based (0 = January, 1 = February, ...)
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }

    return new Date();
}

const program = new Command();
program
    .name('blog-builder')
    .description('CLI to build my blog')
    .version('0.0.1');

program.command('rss')
    .description('Update RSS feed')
    .action(async () => {
        const { posts } = JSON.parse(await readFile("./database/db.json", "utf-8"));
        const sortedPosts = posts.sort((a, b) => date2int(a.lastUpdate) - date2int(b.lastUpdate));
        const feed = new RSS({
            title: `Pedroth's Corner`,
            description: `Pedroth's Corner: Maths.Computer Science.Philosophy`,
            feed_url: `${HOME}/feed/rss.xml`,
            site_url: HOME,
            language: 'en-us'
        });
        sortedPosts.forEach(({ title, id, lastUpdate }) => {
            feed.item({
                title,
                description: title,
                url: `${HOME}/?p=post/${id}/${id}.nd`,
                date: parseDate(lastUpdate),
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
    });

program.command('build-java')
    .description('Create a zip with the necessary dependencies to run java apps of several blog posts')
    .action(() => {
       buildJavaPosts();
    });


program.parse();