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
function buildThumbnail(name,megaDiv,w,h,language) {
  /* construction of box */
  var div = document.createElement('li');
  var nameH = document.createElement('h3');
  nameH.innerHTML = "<" + language + ">" + name;
  var link = document.createElement('a');
  link.setAttribute('href',"https://" + language + "Experiments/" + name + "/" + name + ".html");
  var img = document.createElement('img');
  img.setAttribute("src",language + "Experiments/" + name + "/" + name + ".gif");
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
  while(stack.length > 0 ) {
    var high = stack.pop();
    var low = stack.pop();
    /*
    * partition
    */
    if(low < high) {
      var pivot = low + Math.floor((high - low) * Math.random());
      var pvalue = key(v,pivot);
      swap(v,pivot,high);
      var j = 0;
      for (var i = 0; i < high; i++) {
        if(key(v,i) <= pvalue) {
          swap(v,i,j);
          j++;
        }
      }
      swap(v,j,high);
      stack.push(low);
      stack.push(j-1);
      stack.push(j+1);
      stack.push(high);
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
  var numOfApps = 5;
  var imgW = 200;
  var text1 = LoadFile("tools/AppletNames.txt");
  var text2 = LoadFile("tools/AppJs.txt");

  var appletsName = text1.split("\n");
  var appJsNames = text2.split("\n");
  /**
  * retrive apps from files
  */
  var apps = [];
  for (var i = 0; i < appletsName.length + appJsNames.length; i++) {
    if(i < appletsName.length) {
      apps[i] = appletsName[i].split(" ");
      apps[i][2] = "Java";
    } else {
      apps[i] = appJsNames[i - appletsName.length].split(" ");
      apps[i][2] = "Js";
    }
  }
  /**
  * process dates from the apps
  */
  for (var i = 0; i < apps.length; i++) {
    var dateStrs = apps[i][1].split("/");
    var acm = 0; 
    var ide = 1;
    for (var j = 0; j < dateStrs.length; j++) {
      acm += parseFloat(dateStrs[j]) * ide;
      ide *= 100;
    }
    apps[i][1] = acm;
  }

  sort(apps, key);
  /**
  * Recent
  */
  var recentDiv = document.createElement('ul');
  recentDiv.setAttribute("class", "rig");
  var h2Latest = document.createElement('h2');
  h2Latest.innerHTML = "Recent Experiments";
  recentDiv.appendChild(h2Latest);
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(recentDiv);
  for (var i = apps.length - 1; i >= (apps.length - numOfApps); i--) {
    buildThumbnail(apps[i][0],recentDiv,imgW,imgW,apps[i][2]);
  }
  /**
  * Random
  **/
  var randomDiv = document.createElement('ul');
  randomDiv.setAttribute("class", "rig");
  var h2Random = document.createElement("h2");
  h2Random.innerHTML = "Random Experiments";
  randomDiv.appendChild(h2Random);
  var mainSection = document.getElementById("main_content");
  mainSection.appendChild(randomDiv);
  
  for (var i = 0; i < apps.length; i++) {
    apps[i][1] = Math.floor(apps.length * Math.random());
  };

  sort(apps, key);
  
  for (var i = 0; i < numOfApps; i++) {
    buildThumbnail(apps[i][0],randomDiv,imgW,imgW,apps[i][2]);
  }
}

build();
