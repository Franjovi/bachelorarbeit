function analyseJSON() {    
    /* String zu JSON-Objekt umwandeln */
    var jsonObject = JSON.parse(suggestion.fileAsString);
    
    getObject(jsonObject);  
}

/* Schlüssel im JSON-Objekt suchen und zuweisen */
function getObject(theObject) {
    var result = null;
    
    /* Überprüfung ob der Schlüssel wiederum ein Objekt oder Array ist */
    if (theObject instanceof Array) {        
        // gesamte Länge des JSON-Schlüssels iterieren
        for(var i = 0; i < theObject.length; i++) {
            result = getObject(theObject[i]);
            if (result) {
                break;
            }   
        }
    }
    else {
        for (var prop in theObject) {          
            // Schlüssel des Objektes als numerischen Index verfügbar machen
            var keys = Object.keys(suggestion.suggestions);  
              
            // alle geforderten Metatags durchlaufen und suchen
            for (var i = 0; i < suggestion.tags.length; i++) {
                // Wildcard-Muster definieren, damit die Schlüssel besser erkannt werden können
                var pattern = suggestion.tags[i];
            
                // Vorschläge je nach Tag an das Suggestion-Objekt zuweisen
                if(prop.indexOf(pattern) !== -1) {  
                    suggestion.suggestions[keys[i]].push(theObject[prop]);  
                           
                    //if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) 
                    
                    getChildKeys(suggestion.suggestions[keys[i]]);
                }           
            }
            
            for (var i = 0; i < suggestion.alternateTags.length; i++) {  
                // Wildcard-Muster definieren, damit die Schlüssel besser erkannt werden können
                var pattern = suggestion.alternateTags[i];
            
                // Vorschläge je nach Tag an das Suggestion-Objekt zuweisen
                if (prop.indexOf(pattern) !== -1) {  
                    suggestion.suggestions[keys[i]].push(theObject[prop]);  
                           
                    //if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) 
                    
                    getChildKeys(suggestion.suggestions[keys[i]]);  
                }  
            }

            // rekursiver Aufruf der Funktion mit allen Sub-Keys
            if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = getObject(theObject[prop]);
                
                if (result) break;
            } 
        }
    }  
    
    return;  
}

function getChildKeys(parentKey) {
    for (var prop in parentKey) {        
        if (parentKey[prop] instanceof Object || parentKey[prop] instanceof Array) {
            result = getChildKeys(parentKey[prop]);  
        
            if (result) break;
        } 
    }
}