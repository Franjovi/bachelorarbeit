function Suggestion(file) {
    this.tags = [];
    this.tagTranslations = [];
    this.alternateTags = [];
    this.suggestions = {};
    this.fileReference = file; 
    this.fileAsString;
}

/* Formular-Tags anhand HTML-Klasse zuweisen */
Suggestion.prototype.assignTags = function(inputClass) {   
    var self = this;
    
    $("." + inputClass + ":not(.excluded)").each(function(i, obj) {
        var id = $(this).attr('id');  
        
        self.tags.push(id);  
        // leeres Objekt mit Arrays für die Vorschläge reservieren
        self.suggestions[$(this).attr('id')] = [];
    });   
};

/* Dictionary-Schnittstelle aufrufen und Metatags übersetzen */
Suggestion.prototype.translateTags = function(language) {
    $.each(this.tags, function(index, value) {
        $.ajax({
            url: 'https://glosbe.com/gapi/translate',
            type: 'get',
            data: {
                from : 'eng',
                dest : language,
                format : 'jsonp',
                phrase: 'title',
                pretty: true
            },
            dataType: 'jsonp',
            success: function(data) {
                //this.metaTagTranslations;
            }
        });     
    });
};

/* Doppelte Trefferchance durch Synonymverwendung */
Suggestion.prototype.assignAlternateTags = function() {
    var alternateTags = [
        'name',
        'information',
        'keyword',
        'permission',
        'institution',
        'view',
        'revision',
        'publisher',
        'contact',
        'support',
        'link'        
    ];
    
    for(var alternateTag in alternateTags) {
        this.alternateTags.push(alternateTags[alternateTag]);   
    } 
};

/* Datei als String erneut einlesen */
Suggestion.prototype.readAsString = function() {
    //var blob = new Blob([this.fileReference.fileStream]);  
    self = this;            
    var reader = new FileReader();
    
    reader.onload = function(e) {
        self.fileAsString = reader.result; 
        
        /* Weitere Funktionen nur aufrufbar im Callback, da asynchrone Daten */
        self.routeScript();
    }
   
    reader.readAsText(file.filePointer);    
};

/* Skript für Dateiformate aufrufen */
Suggestion.prototype.routeScript = function() {      
    switch(file.fileType) {
        case 'CSV': 
            analyseCSV();                    
            break;
        case 'JSON': 
            analyseJSON();  
            break;
        case 'PDF': 
            analysePDF();
            break;
        case 'TXT': 
            analyseTXT();
            break;
        case 'XLSX':
        case 'XLS': 
            analyseXLS();
            break;
        case 'HTML':
        case 'XML': 
            analyseXML();
            break;
        default:
            break;
    }  
    
    suggestion.displaySuggestions(); 
};

Suggestion.prototype.displaySuggestions = function() {
    var keys = Object.keys(this.suggestions); 

    for (var i = 0; i < keys.length; i++) {
        var options = '';

        var formField = keys[i]; 
        var tagArray = this.suggestions[keys[i]];  
        
        options += '<optgroup label="Inhaltliche Tags">';
       
        for(var j = 0; j < tagArray.length; j++) { 
            if (j == 0) 
                options += '<option selected value="' + j + '">' + tagArray[j] + '</option>';
            else 
                options += '<option value="' + j + '">' + tagArray[j] + '</option>';
        }
        
        options += '</optgroup>';
        
        $("#suggestion-" + formField).append(options);
    }    
};

Suggestion.prototype.displayDBSuggestions = function(data) {
    var generalOrganizations = data[0];
    var generalTags = data[1];
    var generalUsers = data[2];
    var generalPackages = data[3];
    var generalLicenses = data[4];
    var generalMaintainers = data[5];
    var generalMaintainerMails = data[6];
    var generalAuthors = data[7];
    var generalAuthorMails = data[8];
    var generalDescriptions = data[9];
            
    var userOrganizations = data[10];
    var organizationTitles = data[11];
    var organizationLicenses = data[12];
    var organizationMaintainers = data[13];
    var organizationMaintainerMails = data[14];
    var organizationAuthors = data[15];
    var organizationAuthorMails = data[16]; 
            
    var html = '<optgroup label="Portaltags">';
        for (var i = 0; i < organizationTitles.length; i++) {
            if (organizationTitles[i] != "") {
                html += '<option value="' + organizationTitles[i] + '">' + organizationTitles[i] + '</option>';     
            }   
        }    
    html += '</optgroup>';
    
    $("#suggestion-title").append(html);
    
    var html = '<optgroup label="Portaltags">';
        for (var i = 0; i < generalDescriptions.length; i++) {
            if (generalDescriptions[i] != "") {
                html += '<option value="' + generalDescriptions[i] + '">' + generalDescriptions[i] + '</option>';  
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-description").append(html);
    
    var html = '<optgroup label="Portaltags">';
        for (var i = 0; i < generalTags.length; i++) {
            if (generalTags[i] != "") {
                html += '<option value="' + generalTags[i] + '">' + generalTags[i] + '</option>';
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-tag").append(html);
    
    var html = '<optgroup label="Organisationstags">';
        for (var i = 0; i < userOrganizations.length; i++) {
            if (userOrganizations[i] != "") {
                html += '<option value="' + userOrganizations[i] + '">' + userOrganizations[i] + '</option>';    
            }
        }    
    html += '</optgroup>';
    
    html += '<optgroup label="Portaltags">';
        for (var i = 0; i < generalOrganizations.length; i++) {
            if (generalOrganizations[i] != "") {
                html += '<option value="' + generalOrganizations[i] + '">' + generalOrganizations[i] + '</option>';    
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-organisation").append(html);
    
    
    var html = '<optgroup label="Organisationstags">';
        for (var i = 0; i < organizationLicenses.length; i++) {
            if (organizationLicenses[i] != "") {
                html += '<option value="' + organizationLicenses[i] + '">' + organizationLicenses[i] + '</option>';    
            }
        }    
    html += '</optgroup>';
    
    html += '<optgroup label="Portaltags">';
        for (var i = 0; i < generalLicenses.length; i++) {
            if (generalLicenses[i] != "") {
                html += '<option value="' + generalLicenses[i] + '">' + generalLicenses[i] + '</option>'; 
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-license").append(html);
    
    
    var html = '<optgroup label="Organisationstags">';
        for (var i = 0; i < organizationMaintainers.length; i++) {
            if (organizationMaintainers[i] != "") {
                html += '<option value="' + organizationMaintainers[i] + '">' + organizationMaintainers[i] + '</option>';    
            }
        }    
    html += '</optgroup>';
    
    html += '<optgroup label="Portaltags">';
        for (var i = 0; i < generalMaintainers.length; i++) {
            if (generalMaintainers[i] != "") {
                html += '<option value="' + generalMaintainers[i] + '">' + generalMaintainers[i] + '</option>';    
            }
        }    
    
        for (var i = 0; i < generalUsers.length; i++) {
            if (generalUsers[i] != "") {
                html += '<option value="' + generalUsers[i] + '">' + generalUsers[i] + '</option>';  
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-maintainer").append(html);
    
    
    var html = '<optgroup label="Organisationstags">';
        for (var i = 0; i < organizationMaintainerMails.length; i++) {
            if (organizationMaintainerMails[i] != "") {
                html += '<option value="' + organizationMaintainerMails[i] + '">' + organizationMaintainerMails[i] + '</option>';   
            }
        }    
    html += '</optgroup>';
    
    html += '<optgroup label="Portaltags">';
        for (var i = 0; i < generalMaintainerMails.length; i++) {
            if (generalMaintainerMails[i] != "") {
                html += '<option value="' + generalMaintainerMails[i] + '">' + generalMaintainerMails[i] + '</option>';    
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-email-maintainer").append(html);
    
    
    var html = '<optgroup label="Organisationstags">';
        for (var i = 0; i < organizationAuthors.length; i++) {
            if (organizationAuthors[i] != "") {
                html += '<option value="' + organizationAuthors[i] + '">' + organizationAuthors[i] + '</option>';    
            }
        }    
    html += '</optgroup>';
    
    html += '<optgroup label="Portaltags">';
        for (var i = 0; i < generalAuthors.length; i++) {
            if (generalAuthors[i] != "") {
                html += '<option value="' + generalAuthors[i] + '">' + generalAuthors[i] + '</option>'; 
            }
        }    
    
        for (var i = 0; i < generalUsers.length; i++) {
            if (generalUsers[i] != "") {
                html += '<option value="' + generalUsers[i] + '">' + generalUsers[i] + '</option>';
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-author").append(html);
    
    
    var html = '<optgroup label="Organisationstags">';
        for (var i = 0; i < organizationAuthorMails.length; i++) {
            if (organizationAuthorMails[i] != "") {
                html += '<option value="' + organizationAuthorMails[i] + '">' + organizationAuthorMails[i] + '</option>';   
            }
        }    
    html += '</optgroup>';
    
    html += '<optgroup label="Portaltags">';
        for (var i = 0; i < generalAuthorMails.length; i++) {
            if (generalAuthorMails[i] != "") {
                html += '<option value="' + generalAuthorMails[i] + '">' + generalAuthorMails[i] + '</option>';   
            }
        }    
    html += '</optgroup>';
    
    $("#suggestion-email-author").append(html);
};
