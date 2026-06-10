import { watch } from "fs";
import { spawn } from "child_process";

const post = process.argv[2];
if (!post) {
  console.error("Usage: bun scripts/watch-post.js <PostName>");
  process.exit(1);
}

const file = `posts/${post}/${post}.nd`;

console.log(`Watching ${file} ...`);

let building = false;

watch(file, () => {
  if (building) return;
  building = true;
  console.log(`[${new Date().toLocaleTimeString()}] Change detected, rebuilding...`);
  const proc = spawn("bun", ["run", "build-posts", "-p", post], { stdio: "inherit" });
  proc.on("close", () => {
    building = false;
  });
});
