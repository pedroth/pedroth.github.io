cd posts/
for folderName in $(ls); do
    echo $folderName
    cd $folderName
    ffmpeg -c:v libvpx -i ${folderName}.webm -vf "scale=1980:1080" ${folderName}.webp
    ffmpeg -c:v libvpx -i ${folderName}.webm -vf "scale=990:540" ${folderName}_medium.webp
    ffmpeg -c:v libvpx -i ${folderName}.webm -vf "scale=495:270" ${folderName}_small.webp
    cd ..
done