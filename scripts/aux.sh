# Remove folders from build-java 
# cd posts/
# for folderName in $(ls); do
#     cd $folderName
#     echo cd $folderName \&\& rm -rf ./tmp
#     rm -rf ./tmp
#     echo rm -rf ./${folderName}.zip
#     rm -rf ./${folderName}.zip
#     cd ..
# done

# Remove small images from posts
# find posts -name "*_small.webp" -type f -delete


# Remove index.html from posts
# find posts -name "index.html" -type f -delete