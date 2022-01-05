const fs = require("fs");
const archiver = require("archiver");
const rimraf = require("rimraf");

function rmFolder(path) {
  rimraf.sync(path);
}

function replaceAll(str, search, replace) {
  return str.split(search).join(replace);
}

function readJson(src) {
  const rawData = fs.readFileSync(src);
  return JSON.parse(rawData);
}

function readJarsConfig() {
  const jarSrcCfg = "./java/config.json";
  return readJson(jarSrcCfg);
}

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function copyFile(srcPath, destPath) {
  fs.copyFileSync(srcPath, destPath);
}

function createReadMe(jarName, appName) {
  let readMe = fs.readFileSync(`./java/README.md`, {
    encoding: "utf-8"
  });
  readMe = replaceAll(readMe, "${jar}", jarName);
  readMe = replaceAll(readMe, "${appName}", appName);
  return readMe;
}

function createRunBat(jarName, appName) {
  let runBat = fs.readFileSync(`./java/run.bat`, {
    encoding: "utf-8"
  });
  runBat = replaceAll(runBat, "${jar}", jarName);
  runBat = replaceAll(runBat, "${appName}", appName);
  return runBat;
}

function createRunDocker(repo, jarName, appName) {
  let runDocker = fs.readFileSync(`./java/runDocker.sh`, {
    encoding: "utf-8"
  });
  const jarLocal = `${repo}/${jarName}`;
  runDocker = replaceAll(runDocker, "${jar}", jarLocal);
  runDocker = replaceAll(runDocker, "${appName}", appName);
  return runDocker;
}

function zipIt(src, dest, afterZip = () => {}) {
  const output = fs.createWriteStream(dest);
  const archive = archiver("zip");

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
    afterZip();
  });

  archive.pipe(output);
  archive.directory(src, false);
  archive.finalize();
}

function processJars() {
  const config = readJarsConfig();
  config.jars.forEach((jar, i) => {
    const name = jar.id;
    console.log("Processing ...", name);

    const zipPath = `../../posts/${name}/${name}.zip`;
    const newJarName = `${name}.jar`;
    const tmpFolder = `../../posts/${name}/tmp`;

    console.log("Creating folder...", tmpFolder);

    createDir(tmpFolder);
    const readMe = createReadMe(newJarName, jar.in);
    const runBat = createRunBat(newJarName, jar.in);
    const runDocker = createRunDocker(jar.repo, jar.from, jar.in);
    // fs.writeFileSync(tmpFolder + `/README.txt`, readMe);
    fs.writeFileSync(tmpFolder + `/README.md`, readMe);
    fs.writeFileSync(tmpFolder + `/run.bat`, runBat);
    fs.writeFileSync(tmpFolder + `/run.sh`, runBat);
    fs.writeFileSync(tmpFolder + `/runDocker.sh`, runDocker);
    copyFile(`./java/${jar.from}`, tmpFolder + `/${newJarName}`);

    console.log("zipping folder", tmpFolder, zipPath);
    zipIt(tmpFolder, zipPath, () => {
      console.log("rm dir", tmpFolder);
      rmFolder(tmpFolder);
    });
  });
}

function logDockerCommands() {
  const config = readJarsConfig();
  const commands = [];
  config.jars.forEach(({ from, in: jarIn, repo }) => {
    console.log(`- \`${createRunDocker(repo, from, jarIn)}\``);
  });
}

function main() {
  processJars();
  logDockerCommands();
}
main();
