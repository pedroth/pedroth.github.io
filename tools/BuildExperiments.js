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
* x,y position
* w,h width and height
*/
function buildThumbnail(name,x,y,w,h) {
  var megaDiv = document.getElementById("megaDiv");
  /* construction of box */
  var div = document.createElement('li');
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

function build(address) {
  var text = LoadFile(address);
  var appsName = text.split("\n");
  var megaDiv = document.createElement('ul');
  megaDiv.setAttribute("id","megaDiv");
  megaDiv.setAttribute("class", "rig");
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(megaDiv);
  for (var i = 0; i < appsName; i++) {
    var name = appsName[i].split(" ");
    buildThumbnail(name[0],x,y,step,step);
  }
}

build(document.getElementById("input").value); 
