function analyseCSV() {
    var keys = Object.keys(suggestion.suggestions); 
    
    Papa.parse(suggestion.fileAsString, {
        worker: true,
	    complete: function(results) {       
            var flag = false;
            
            /* Kopfzeile auslesen und Länge bestimmen */
            var headerRow = results.data[0];
            var headerLength = headerRow.length;
            
            /* Kopfzeile mit gesuchten Tags vergleichen */
            for (var i = 0; i < headerLength; i++) {            
                if (suggestion.tags.indexOf(headerRow[i]) != -1) {
                    flag = true;
                    
                    var rowContent = [];
                    
                    for (var j = 0; j < 10; j++) {
                        rowContent.push(results.data[j][i]);
                    }  
                    
                    for (var k = 0; k < rowContent.length; k++) {                   
                        suggestion.suggestions[keys[suggestion.tags.indexOf(headerRow[i])]].push(rowContent[k]);    
                    }
                }
                
                if (suggestion.alternateTags.indexOf(headerRow[i]) != -1) {
                    flag = true;
                    
                    var rowContent = [];
                    
                    for (var j = 0; j < 10; j++) {
                        rowContent.push(results.data[j][i]);
                    }  
                    
                    for (var k = 0; k < rowContent.length; k++) {                   
                        suggestion.suggestions[keys[suggestion.alternateTags.indexOf(headerRow[i])]].push(rowContent[k]);     
                    }
                }
            }    
            
            /* Fallback, falls kein passender Tag gefunden wurde */
            if (flag != true) {
                /* Die ersten 3 Werte retournieren */
                for (var i = 0; i < headerLength; i++) {
                    var rowContent = [];
                    
                    for (var j = 0; j < 2; j++) {  
                        rowContent.push(results.data[j][i]);    
                    }
                    
                    for (var k = 0; k < rowContent.length; k++) {
                        for (var l = 0; l < 3 ; l++) {
                            suggestion.suggestions[keys[l]].push(rowContent[k]);     
                        }    
                    }
                }
            }
	   }
    });     
}


