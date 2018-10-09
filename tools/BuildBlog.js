function LoadFile(file) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        xmlhttp.open("GET", file, false); // the false makes this synchronous!
        xmlhttp.send();
        var text = xmlhttp.responseText;
        return text;
    }
}

/**
 * x,y position
 * w,h width and height
 */
function buildThumbnail(app, w, h) {
    var megaDiv = document.getElementById("megaDiv");
    /* construction of box */
    var div = document.createElement('li');
    var nameH = document.createElement('h4');
    nameH.innerHTML = "" + app[2];
    var link = document.createElement('a');
    link.setAttribute('href', app[0] + "/" + app[0] + ".html");
    var img = document.createElement('img');
    img.setAttribute("src", app[0] + "/" + app[0] + ".gif");
    img.setAttribute("width", w);
    img.setAttribute("height", h);

    var link2 = document.createElement('a')
    link2.setAttribute('href', app[0] + "/" + app[0] + ".html")

    link2.appendChild(nameH)
    link.appendChild(img);
    div.appendChild(link);
    div.appendChild(link2);
    megaDiv.appendChild(div);
}

function buildList(app, w, h) {
    // get mega div
    var megaDiv = $("#megaDiv");
    // create base dic
    var div = $('<div></div>');
    //create title with hyperlink
    var title = $("<h2></h2>");
    title.html(app[2]);
    var link = $("<a href=" + app[0] + "/" + app[0] + ".html></a>");
    link.append(title);
    div.append(link);
    
    // create image and description div
    var divBelow = $('<div class="form-group row"></div>')
    
    // create image link
    var linkImage = $('<a class="col-sm-auto" href="' + app[0] + '/' + app[0] + '.html"></a>');
    var img = $('<img src="' + app[0] + '/' + app[0] + '.gif"></img>');
    img.attr("width", w);
    img.attr("height", h);
    linkImage.append(img);
    divBelow.append(linkImage);
    
    // create description
    var description = $('<h4 class="col-sm-auto"></h4>');
    description.html(app[3]);
    divBelow.append(description);

    // final append
    div.append(divBelow);
    div.append($("<hr>"))
    megaDiv.append(div);
}

function swap(v, i, j) {
    if (i >= 0 && i < v.length && j >= 0 && j < v.length) {
        var temp = v[i];
        v[i] = v[j];
        v[j] = temp;
    }
}

function sort(v, key) {
    var n = v.length;
    var stack = [];
    stack.push(0);
    stack.push(n - 1);
    while (stack.length > 0) {
        var high = stack.pop();
        var low = stack.pop();
        /*
         * partition
         */
        if (low < high) {
            var pivot = low + Math.floor((high - low) * Math.random());
            var pvalue = key(v, pivot);
            swap(v, pivot, high);
            var j = 0;
            for (var i = 0; i < high; i++) {
                if (key(v, i) <= pvalue) {
                    swap(v, i, j);
                    j++;
                }
            }
            swap(v, j, high);
            stack.push(low);
            stack.push(j - 1);
            stack.push(j + 1);
            stack.push(high);
        }
    }
}

function key(apps, i) {
    return apps[i][1];
}

function date2int(date) {
    var dateStrs = date.split("/");
    var acm = 0;
    var ide = 1;
    for (var j = 0; j < dateStrs.length; j++) {
        acm += parseFloat(dateStrs[j]) * ide;
        ide *= 100;
    }
    return acm;
}

function build(address, buildMethod, buildMegaDiv, imageSize) {
    var imgW = imageSize;

    var mainSection = $("#main_content");
    mainSection.empty();
    /**
     * read database
     */
    var text = LoadFile(address);
    /**
     * process data
     */
    var appsName = text.split("\n");
    var apps = [];
    for (var i = 0; i < appsName.length; i++) {
        apps[i] = appsName[i].split(";");
        apps[i][1] = date2int(apps[i][1]);
    }
    sort(apps,key);
    var megaDiv = buildMegaDiv();
    mainSection.append(megaDiv);
    for (var i = apps.length - 1; i >= 0; i--) {
      buildMethod(apps[i],imgW,imgW);
    };
}

function listMegaDiv() {
    return $('<div class="container"><div class="row"><div class="col-lg-auto col-md-auto mx-auto" id="megaDiv"></div></div></div>');
}

function gridMegaDiv() {
    var megaDiv = document.createElement('ul');
    megaDiv.setAttribute("id", "megaDiv");
    megaDiv.setAttribute("class", "list-inline");
    return megaDiv;
}


build(document.getElementById("input").value, buildList, listMegaDiv, 250);
function gridListSwitch() {
    if($("#listGridIcon").attr("class") == "glyphicon glyphicon-th") {
        $("#listGridIcon").attr("class", "glyphicon glyphicon-th-list");
        build($("#input").val(), buildThumbnail, gridMegaDiv, 200)
    } else {
        $("#listGridIcon").attr("class", "glyphicon glyphicon-th");
        build($("#input").val(), buildList, listMegaDiv, 250);
    }
}
