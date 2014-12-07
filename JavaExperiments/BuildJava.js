function readFile() {
  $.get("22.txt", function(data) {
    alert(data);
}
}

console.log(readFile());