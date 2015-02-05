function LoadFile(file) {
   var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
         xmlhttp=new XMLHttpRequest();
    } else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if ( xmlhttp != null ) { 
        xmlhttp.open("GET",file,false); // the false makes this synchronous!
        xmlhttp.send( );
        var text = xmlhttp.responseText;
        return text;
    }
}

/**
* w,h width and height
*/
function buildThumbnail(name,megaDiv,w,h) {
  /* construction of box */
  var div = document.createElement('div');
  var nameH = document.createElement('h3');
  nameH.innerHTML = "" + name;
  var link = document.createElement('a');
  link.setAttribute('href',name + "/" + name + ".html");
  var img = document.createElement('img');
  img.setAttribute("src",name + "/" + name + ".gif");
  img.setAttribute("width",w);
  img.setAttribute("height",h);
  link.appendChild(img);
  div.appendChild(link);
  div.appendChild(nameH);
  megaDiv.appendChild(div);
}

function build() {
  var text1 = LoadFile("tools/AppletNames.txt");
  var text2 = LoadFile("tools/AppJs.txt");

  var appletsName = text1.split("\n");
  var appJsNames = text2.split("\n");

  var apps = [];
  for (var i = 0; i < appletsName.length + appJsNames.length; i++) {
    if(i < appletsName.length) {
      apps[i] = appletsName[i].split(" ");
    } else {
      apps[i] = appJsNames[i - appletsName.length].split(" ");
    }
  }
  
  var recentDiv = document.createElement('div');
  var h2Latest = document.createElement('h2');
  h2Latest.innerHTML = "Recent Experiments";
  recentDiv.appendChild(h2);
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(recentDiv);

  var randomDiv = document.createElement('div');
  var h2Random = document.createElement("h2");
  h2Random.innerHTML = "Random Experiments";
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(randomDiv);
}

build();
