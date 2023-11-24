import { readFileSync, writeFileSync } from "fs";
import { Command } from "commander";
import buildRssFeed from "./build-rss.js";
import buildJavaPosts from "./build-java.js";
import buildPosts from "./build-posts.js";
import buildImages from "./build-images.js";


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
    .action(() => {
        const posts = buildPosts();
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

program.parse();