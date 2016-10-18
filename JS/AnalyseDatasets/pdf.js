function analysePDF() {
    var keys = Object.keys(suggestion.suggestions); 
    
    /* File-Pointer statt String an PDF.JS übergeben */    
    var reader = new FileReader();
    var str = "";
    
    reader.onload = function(e) {
        arrayContent = reader.result; 

        
        PDFJS.getDocument(arrayContent).then(function(pdf) {            
            var maxPages = pdf.pdfInfo.numPages;
         
            for (var j = 1; j <= 1; j++) {
                var page = pdf.getPage(j); 
 
                var processPageText = function processPageText(pageIndex) {
                    return function(pageData, content) {
                        return function(text) {
                            for (var i = 0; i < text.items.length; i++) {
                                str += text.items[i].str;
                            }
                            
                            var line = str.split(/\r\n|\r|\n/g);
                            
                            for (var k = 0; k < 10; k++) {
                                for (var l = 0; l < 3; l++) {
                                    //suggestion.suggestions[keys[l].push(line[]);
                                }    
                            }                          
                          
                            /*if (pageData.pageInfo.pageIndex === maxPages - 1) {
                                console.log(str);
                            }*/
                        }
                    } 
                }(j);

                var processPage = function processPage(pageData) {
                    var content = pageData.getTextContent();

                    content.then(processPageText(pageData, content));
                }

                page.then(processPage);
            }            
        }); 
    }
  
    reader.readAsArrayBuffer(file.filePointer);     
  
    /* String umwandeln und als URI an die PDF.JS Bibliothek übergeben */
    var binaryRepresentation = b64EncodeUnicode(suggestion.fileAsString); 
    var dataURI = "data:application/pdf;base64," + binaryRepresentation;  
}

/* String der eingelesenen Datei in Base64 Repräsentation umwandeln */
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

/* DataURI in Binärdaten umwandeln */
function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);        
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return array;
}