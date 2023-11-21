import { Command } from "commander";
import buildRssFeed from "./build-rss.js";
import buildJavaPosts from "./build-java.js";
import { updateDates } from "./build-posts.js";


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
program.command('update-dates')
    .description('Update dates of posts using git log info')
    .action(() => {
        updateDates();
    });


program.parse();