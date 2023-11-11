# Remove folders from build-java 
cd posts/
for folderName in $(ls); do
    cd $folderName
    echo cd $folderName \&\& rm -rf ./tmp
    rm -rf ./tmp
    echo rm -rf ./${folderName}.zip
    rm -rf ./${folderName}.zip
    cd ..
done