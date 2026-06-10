import { readFileSync, writeFileSync } from "fs";
import { Command } from "commander";
import buildRssFeed from "./build-rss.js";
import buildJavaPosts from "./build-java.js";
import buildPosts from "./build-posts.js";
import buildImages from "./build-images.js";
import { renderOfflineHTML } from "../src/PedroDown.js";
import { writeFile } from "fs/promises";


const program = new Command();
program
    .name('blog-builder')
    .description('CLI to build my blog')
    .version('0.0.1');
program.command('rss')
    .description('Update RSS feed')
    .action(() => {
        buildRssFeed();
    });
program.command('build-java')
    .description('Create a zip with the necessary dependencies to run java apps of several blog posts')
    .action(() => {
        buildJavaPosts();
    });
program.command('build-posts')
    .description('Create DB from posts')
    .option('-p, --post <id>', 'Specify a post ID to build')
    .action(async (options) => {
        const selectedPostId = options.post;
        const posts = await buildPosts(selectedPostId);
        let db = { posts: [] };
        try {
            db = JSON.parse(
                readFileSync("./database/db.json", "utf-8")
            );
        } catch (e) {
            console.log("File doesn't exist")
        }
        db.posts = posts;
        writeFileSync("./database/db.json", JSON.stringify(db, null, 2));
    });
program.command('build-images')
    .description('Create necessary images for blog cards')
    .action(() => {
        buildImages();
    })
program.command('build-about')
    .description('Build the about page')
    .action(async () => {
        const ndFile = readFileSync("./src/pages/about/about.nd", { encoding: "utf-8" });
        const content = await renderOfflineHTML(ndFile);
        await writeFile("./src/pages/about/index.html", content);
    });

program.parse();