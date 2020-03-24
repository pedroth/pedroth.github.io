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
  const rawdata = fs.readFileSync(src);
  return JSON.parse(rawdata);
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
  let readMe = fs.readFileSync(`./java/README.txt`, {
    encoding: "utf-8"
  });
  readMe = replaceAll(readMe, "<jar>", jarName);
  readMe = replaceAll(readMe, "<app name>", appName);
  return readMe;
}

function createRunBat(jarName, appName) {
  let runBat = fs.readFileSync(`./java/run.bat`, {
    encoding: "utf-8"
  });
  runBat = replaceAll(runBat, "<jar>", jarName);
  runBat = replaceAll(runBat, "<app name>", appName);
  return runBat;
}

function zipIt(src, dest, afterZip = () => {}) {
  const output = fs.createWriteStream(dest);
  const archive = archiver("zip");

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on("close", function() {
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
    fs.writeFileSync(tmpFolder + `/README.txt`, readMe);
    fs.writeFileSync(tmpFolder + `/README.md`, readMe);
    fs.writeFileSync(tmpFolder + `/run.bat`, runBat);
    fs.writeFileSync(tmpFolder + `/run.sh`, runBat);
    copyFile(`./java/${jar.from}`, tmpFolder + `/${newJarName}`);

    console.log("ziping folder", tmpFolder, zipPath);
    zipIt(tmpFolder, zipPath, () => {
      console.log("rm dir", tmpFolder);
      rmFolder(tmpFolder);
    });
  });
}

function main() {
  processJars();
}
main();
