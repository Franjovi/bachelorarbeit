function analyseTXT() {
    var keys = Object.keys(suggestion.suggestions); 
    
    var textLines = suggestion.fileAsString.split(/\r\n|\r|\n/g);    
    var lineCount = suggestion.fileAsString.split(/\r\n|\r|\n/g).length;
    
    /* maximal 15 Zeilen einlesen */
    var lineLimit = (lineCount > 10) ? 10 : lineCount;

    for (var i = 0; i < lineLimit; i++) {
        for (var l = 0; l < 3 ; l++) {
            suggestion.suggestions[keys[l]].push(textLines[i]);     
        }     
    }
}  