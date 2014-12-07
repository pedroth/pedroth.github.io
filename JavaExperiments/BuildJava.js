function readFile() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "Test.txt", true);
    txtFile.onreadystatechange = function()
    {
      if (txtFile.readyState === 4) {  // document is ready to parse.
        if (txtFile.status === 200) {  // file is found
          allText = txtFile.responseText; 
          lines = txtFile.responseText.split("\n");
        }
      }
    }
    txtFile.send(null);
}

console.log(readFile());