function analyseXML() {
    var keys = Object.keys(suggestion.suggestions); 
    
    /* Text als XML lesen */
    var xmlData = $.parseXML(suggestion.fileAsString); 
    var tagNodes = [];

    /* Suche nach Tags */
    for (var i = 0; i < suggestion.tags.length; i++) {
        var nodeContent = [];
        
        /* XML-Elemente mithilfe des Selektors und jQuery-find suchen */
        var tags = $(xmlData).find(suggestion.tags[i]);                             
        var alternateTags = $(xmlData).find(suggestion.alternateTags[i]);
        
        /* Wert der XML-Elemente im Array zwischenspeichern*/
        for (var j = 0; j < tags.length; j++) 
            nodeContent.push(tags[j]['textContent']);
        
        for (var k = 0; k < alternateTags.length; k++) 
            nodeContent.push(alternateTags[k]['textContent']);
    
        tagNodes.push(nodeContent);
    }

    /* Gefundene XML-Werte an die Suggestion-Klasse übergeben */
    for (var i = 0; i < tagNodes.length; i++) { 
        for (var j = 0; j < tagNodes[i].length; j++) {            
            suggestion.suggestions[keys[i]].push(tagNodes[i][j]); 
        }   
    }  
}