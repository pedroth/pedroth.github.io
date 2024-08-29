//========================================================================================
/*                                                                                      *
 *                                   BUILD JAVA POSTS                                   *
 *                                                                                      */
//========================================================================================


import {
    copyFileSync,
    createWriteStream,
    existsSync,
    mkdirSync,
    readFileSync,
    unlinkSync,
    writeFileSync
} from "fs";
import archiver from "archiver";
import { rimraf } from "rimraf";
import { exec } from 'child_process';

const HOME = `./scripts/build-java`

function rmFolder(path) {
    console.log("removing...", path);
    rimraf.sync(path);
}

function replaceAll(str, search, replace) {
    return str.split(search).join(replace);
}

function readJson(src) {
    const rawData = readFileSync(src);
    return JSON.parse(rawData);
}

function readJarsConfig() {
    const jarSrcCfg = `${HOME}/config.json`;
    return readJson(jarSrcCfg);
}

function createDir(dir) {
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }
}

function copyFile(srcPath, destPath) {
    copyFileSync(srcPath, destPath);
}

function createReadMe(jarName, appName) {
    let readMe = readFileSync(`${HOME}/README.md`, {
        encoding: "utf-8"
    });
    readMe = replaceAll(readMe, "${jar}", jarName);
    readMe = replaceAll(readMe, "${appName}", appName);
    return readMe;
}

function createRunBat(jarName, appName) {
    let runBat = readFileSync(`${HOME}/run.bat`, {
        encoding: "utf-8"
    });
    runBat = replaceAll(runBat, "${jar}", jarName);
    runBat = replaceAll(runBat, "${appName}", appName);
    return runBat;
}

function createRunDocker(repo, jarName, appName) {
    let runDocker = readFileSync(`${HOME}/runDocker.sh`, {
        encoding: "utf-8"
    });
    const jarLocal = `${repo}/${jarName}`;
    runDocker = replaceAll(runDocker, "${jar}", jarLocal);
    runDocker = replaceAll(runDocker, "${appName}", appName);
    return runDocker;
}

function zipIt(src, dest) {
    const output = createWriteStream(dest);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on("close", () => {
        console.log(archive.pointer() + " total bytes");
        console.log("Archiver has been finalized and the output file descriptor has closed.");
    });

    archive.pipe(output);
    archive.directory(src, false);
    return archive.finalize();
}

function createJarsFromDocker() {
    return new Promise((resolve, reject) => {
        const imageId = `pedroth/java-apps`;
        const hostPath = `${HOME}/`;
        const containerPaths = [
            `/apps/Learning/learning.jar`,
            `/apps/pedroEngine/pedroEngine.jar`
        ];
        const commands = containerPaths.map(path => {
            const containerId = `dummy${Math.floor(Math.random() * 100)}`;
            return `docker create --name ${containerId} ${imageId} && docker cp ${containerId}:${path} ${hostPath} && docker rm -f ${containerId}`
        });
        const filesCopied = commands.map(() => false);
        commands.forEach((command, i) => {
            console.log(`Executing command ${command}`);
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log("Caught error while creating jars from docker", error, stderr);
                    reject(error);
                }
                console.log("Created jars", stdout);
                filesCopied[i] = true;
            });
        });
        const checkCopiedFiles = () => {
            if (filesCopied.every(x => x)) {
                return resolve(true);
            }
            setTimeout(checkCopiedFiles, 500);
        }
        checkCopiedFiles();
    });
}

function removeJars() {
    console.log("Removing jars...");
    const jarsFiles = [`${HOME}/learning.jar`, `${HOME}/pedroEngine.jar`];
    jarsFiles.forEach(jar => {
        console.log("Removing jar...", jar);
        unlinkSync(jar);
    });
}

async function processJars() {
    console.log("Processing jars");
    const config = readJarsConfig();
    await createJarsFromDocker();
    console.log("created Jars From Docker");
    config.jars.forEach(async (jar) => {
        const name = jar.id;
        console.log("Processing ...", name);

        const zipPath = `./posts/${name}/${name}.zip`;
        const newJarName = `${name}.jar`;
        const tmpFolder = `./posts/${name}/tmp`;

        console.log("Creating folder...", tmpFolder);

        createDir(tmpFolder);
        const readMe = createReadMe(newJarName, jar.in);
        const runBat = createRunBat(newJarName, jar.in);
        const runDocker = createRunDocker(jar.repo, jar.from, jar.in);
        writeFileSync(tmpFolder + `/README.md`, readMe);
        writeFileSync(tmpFolder + `/run.bat`, runBat);
        writeFileSync(tmpFolder + `/run.sh`, runBat);
        writeFileSync(tmpFolder + `/runDocker.sh`, runDocker);
        copyFile(`${HOME}/${jar.from}`, `${tmpFolder}/${newJarName}`);

        console.log("Zipping folder...", tmpFolder, zipPath);
        await zipIt(tmpFolder, zipPath);
        rmFolder(tmpFolder);
    });
    removeJars();
}

// function logDockerCommands() {
//     const config = readJarsConfig();
//     config.jars.forEach(({ from, in: jarIn, repo }) => {
//         console.log(`- \`${createRunDocker(repo, from, jarIn)}\``);
//     });
// }

export default async function buildJavaPosts() {
    await processJars();
    // logDockerCommands();
}