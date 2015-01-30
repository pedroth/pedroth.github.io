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
  var mainSection = document.getElementById("main_content");
  /* construction of box */
  var div = document.createElement('div');
  div.setAttribute('class', "myDiv");
  div.setAttribute('style', "width:" + w + "px;height:" + (h + 50) + "px;");
  var nameH = document.createElement('h3');
  nameH.innerHTML = "" + name;
  var link = document.createElement('a');
  link.setAttribute('href',name + "/" + name + ".html");
  var img = document.createElement('img');
  if(name === "GraphXY" || name === "CubeChaos") {
  	img.setAttribute("src",name + "/" + name + ".gif");
  } else {
  	img.setAttribute("src",name + "/" + name + ".png");	
  }
  img.setAttribute("width",w);
  img.setAttribute("height",h);
  link.appendChild(img);
  div.appendChild(link);
  //div.appendChild(nameH);
  mainSection.appendChild(div);
}

function build() {
  var text = /*LoadFile("../tools/AppletNames.txt");*/"BrownianMotion\n" + "CellularAutomaton\n" + "CubeChaos\n" + "GraphXY\n" + "ImplicitSurface\n" + "LinesSurfaces\n" + "PDE\n" + "RandomCurve\n" + "SimplePhysics\n" + "SimpleRobot\n" + "TetraZBuffer";
  var appletsName = text.split("\n");
  var n = appletsName.length;
  var columns = 5;
  var step = 200;
  var rows = n / columns;
  for (var i = 0; i < appletsName.length; i++) {
    /*no need for x, and y*/
    var x = step * (i % columns);
    var y = step * (Math.floor(i / columns));
    buildThumbnail(appletsName[i],x,y,step,step);
  }
}

build();
