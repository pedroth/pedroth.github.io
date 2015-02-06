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

function swap(v, i , j) {
  if(i >= 0 && i < v.length && j >= 0 && j < v.length) {
    var temp = v[i];
    v[i] = v[j];
    v[j] = temp;
  }
}

function sort(v,key) {
  var n = v.length;
  var stack = [];
  stack.push(0);
  stack.push(n - 1);
  while(stack.length > 0) {
    var high = stack.pop();
    var low = stack.pop();
    /*
    * partition
    */
    if(low < high) {
      var pivot = Math.floor(n * Math.random());
      var pvalue = key(v,pivot);
      swap(v,pivot,high);
      var j = 0;
      for (var i = 0; i < high-1; i++) {
        if(key(v,i) <= pvalue) {
          swap(v,i,j);
          j++;
        }
        swap(v,j,high);
        stack.push(low);
        stack.push(j-1);
        stack.push(j+1);
        stack.push(high);
      }
    }
  }
}

function powInt(x,i) {
  if(i === 0) {
    return 1;
  } else if(i === 1) {
    return x;
  } else {
    var q = Math.floor(i/2);
    var r = i % 2;
    if(r === 0) {
      return powInt(x * x,q);
    } else {
      return x * powInt(x * x,q);
    }
  }
}

function key(apps,i) {
    return apps[i][1];
};

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
  
  for (var i = 0; i < apps.length; i++) {
    var dateStrs = apps[i][1].split("\/");
    var acm = 0; 
    for (var j = 0; j < dateStrs.length; j++) {
      acm += parseFloat(dateStrs[j]) * powInt(10, 2 * i);
    }
    apps[i][1] = acm;
  }

  sort(apps, key);

  var recentDiv = document.createElement('div');
  var h2Latest = document.createElement('h2');
  h2Latest.innerHTML = "Recent Experiments";
  recentDiv.appendChild(h2Latest);
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(recentDiv);

  var randomDiv = document.createElement('div');
  var h2Random = document.createElement("h2");
  h2Random.innerHTML = "Random Experiments";
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(randomDiv);
}

build();
