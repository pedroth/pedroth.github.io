function LoadFile() {
   var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
         xmlhttp=new XMLHttpRequest();
    } else {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if ( xmlhttp != null ) 
    { 
        xmlhttp.open("GET","Test.txt",false); // the false makes this synchronous!
        xmlhttp.send( );
        var text = xmlhttp.responseText;
        // text contains the ENTIRE CONTENTS of the text file 
        // you *could* just write those contents directly to the HTML output:
        document.write( text );

        // but you might want to process that one line at a time.  if so:
        var lines = text.split( "\n" );
        for ( var n = 0; n < lines.length; ++n )
        {
            var line = lines[n];
            // and now you can do whatever is needed with that line
        }
    }
}

LoadFile();