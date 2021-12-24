# loop through folder
for folderName in $(ls -I *.sh); do
    echo $folderName
    cd $folderName
    rm *.webm
    # ffmpeg -i ${folderName}.gif -c vp9 -b:v 0 -crf 41 ${folderName}.webm
    # ffmpeg -i ${folderName}.gif -vcodec webp -loop 0 -pix_fmt yuv420p ${folderName}.webp
    cd ..
done