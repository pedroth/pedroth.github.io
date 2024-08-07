import { execSync } from "child_process";
import { readdirSync, accessSync, constants } from "fs"

const baseFolder = "./posts"
function checkFileExists(path) {
    console.log("Checking file", path);
    try {
        accessSync(path, constants.F_OK);
        console.log("File exists", path);
        return true;
    } catch (err) {
        console.log(`File ${path} does not exist`);
        return false;
    }
}

function createImage(fromPath, toPath, scale = [1980, 1080]) {
    try {
        execSync(`ffmpeg -c:v libvpx -i ${fromPath} -vf "scale=${scale.join(":")}" ${toPath}`)
        console.log(`Created image ${toPath} from ${fromPath}`)
    } catch (e) {
        console.log(`Something went wrong, when generating ${toPath} from ${fromPath}`);
    }
}

export default function buildImages() {
    readdirSync(baseFolder, { withFileTypes: true })
        .filter(f => f.isDirectory())
        .forEach(folder => {
            const id = folder.name;
            const filePath = `${baseFolder}/${id}/${id}`;
            try {
                if (!checkFileExists(`${filePath}.webp`)) createImage(`${filePath}.webm`, `${filePath}.webp`, [1980, 1080])
                if (!checkFileExists(`${filePath}_medium.webp`)) createImage(`${filePath}.webm`, `${filePath}_medium.webp`, [990, 540])
                if (!checkFileExists(`${filePath}_small.webp`)) createImage(`${filePath}.webm`, `${filePath}_small.webp`, [495, 270])
            } catch (e) {
                console.log("Something went wrong, while trying to generate images");
            }
        })
}