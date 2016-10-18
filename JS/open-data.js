$(document).ready(function() {          
    $(".close-container").on('click', function(e) {
        e.preventDefault(); 
        $(".modal, .modal-container").removeClass('in');    
    });  
    
    $(".navigation .login").on('click', function() {
        $(".modal, .modal-container.login").addClass('in');    
    });
    
    $(".modal-container.login #login").on('click', function(e) {
        e.preventDefault();
        portal = $("#portal option:selected").html(); 
        apiKey = $("#api-key").val();  
        
        $.ajax({
            url: './PHP/Session.php',
            type: 'post',
            data: { 
                portal : portal,
                apiKey : apiKey
            },
            dataType: 'json',
            success: function(data) {
                $(".modal-container.login").removeClass('in');                
                $(".modal-container.information h2").html(data);
                $(".modal-container.information").addClass('in');
                
                if (data == 'Sie haben sich erfolgreich eingeloggt') {
                    setTimeout(function() {
                        $(".modal, .modal-container").removeClass('in');    
                    }, 3000);     
                }                
                else {
                    setTimeout(function() {
                        $(".modal-container.information").removeClass('in'); 
                        $(".modal-container.login").addClass('in'); 
                    }, 2000);   
                }
            }
        });
    });
          
    $("input:file").change(function() {   
        /* Bisherige Werte löschen */
        $(".suggestion-fields").empty();
        
        $(".modal-container.information h2").html('Die Analyse wird durchgeführt');  
        $(".modal, .modal-container.information").addClass('in');        
        
        /* Vorschlagsformular einblenden */
        $(".form-wrapper").addClass('in');
        
        /* API-Support überprüfen */
        if (window.FileReader && window.File && window.Blob) {
            file = new File(this.files[0], $(this).val());
                                                
            if (file instanceof File) {     
                var reader = new FileReader();
                                               
                reader.onload = function(e) {
                    var bufferedInput = reader.result;            
                    var byteStream = new Uint8Array(bufferedInput);   
                    
                    /* spätere Konvertierung in String
                    for(var i = 0; i < byteStream.length; i++) {
                        file.fileStream.push(byteStream[i]);                       
                    }*/                   
          
                    file.getFileName();
                    file.getFileSize(byteStream); 
                                        
                    var magicStream = (new Uint8Array(bufferedInput)).subarray(0, 4);
                    var header = "";         
                                        
                    for(var i = 0; i < magicStream.length; i++) header += magicStream[i].toString(16);                           
                    
                    /* Funktion zur Bestimmung des Dateiformates aus externem Skript aufrufen */     
                    file.getFileType(byteStream, header); 
    	        }
    
                reader.readAsArrayBuffer(file.filePointer);  
            } 
            
            /* Klassenobjekt für Vorschläge instanziieren */
            suggestion = new Suggestion(file);
            suggestion.assignTags('metadata');
            suggestion.assignAlternateTags();
            suggestion.readAsString();
            
            /* Durchforsten der Datenbank nach Vorschlägen */
            crawlPortal();
            
            //suggestion.displayDBSuggestions();
        }
        /* Fallback für Browser ohne HTML5 File API */ 
        else {
            $(this).fileReader();
        
            $(this).on('change', function(e) {
                for (var i = 0; i < e.target.files.length; i++) {
                    file = new File(e.target.files[i], e.target.files[i].name);
                    file.fileName = e.target.files[i].name;
                    file.fileType = e.target.files[i].type;   
                    file.fileSize = e.target.files[i].size; 
                    file.modifiedDate = e.target.files[i].lastModifiedDate;
                }
            });
        }                  
    });

    /* Einzelvorschlag übernehmen */
    $(".add-suggestion").on('click', function() {
        var formField = $(this).attr('class').substr(15); 

        if (formField == 'tag') {
            var fieldValue = $("#suggestion-" + formField + " option:selected").text(); 
            var currentVal = $("#" + formField).val();  
            
            if (currentVal == '') $("#" + formField).val(fieldValue); 
            else $("#" + formField).val(currentVal + ', ' + fieldValue); 
        }
        else if ($("#" + formField).prop('tagName') == 'INPUT') {
            var fieldValue = $("#suggestion-" + formField + " option:selected").text(); 
            $("#" + formField).val(fieldValue);    
        }
        else if ($("#" + formField).prop('tagName') == 'TEXTAREA') {
            var fieldValue = $("#suggestion-" + formField + " option:selected").text();  
            
            $("#" + formField).val(fieldValue); 
        }
        else {  
            var fieldValue = $("#suggestion-" + formField + " option:selected").text(); 
            
            if($("#" + formField + " option[value='" + fieldValue + "']").length == 0) {
                $("#" + formField).append("<option selected value='" + fieldValue + "'>" + fieldValue + "</option>");
            }
            else {
                $("#" + formField + " option[value='" + fieldValue + "']").prop('selected', true);  
            }           
        }
    });
    
    /* alle Vorschläge übernehmen */
    $("#add-all-suggestions").on('click', function(e) {
        e.preventDefault();
        
        $(".suggestion-fields").each(function(i, obj) {
            var formField = $(this).attr('id').substr(11);   
            
            var fieldValue = $("#suggestion-" + formField + " option:selected").text();  
                
            if (fieldValue != '') {
                /* Ziel-Inputformat überprüfen */
                if ($("#" + formField).prop('tagName') == 'INPUT' || $("#" + formField).prop('tagName') == 'TEXTAREA') { 
                    $("#" + formField).val(fieldValue);     
                }
                else {
                    if($("#" + formField + " option[value='" + fieldValue + "']").length == 0) {                    
                        $("#" + formField).append("<option selected value='" + fieldValue + "'>" + fieldValue + "</option>");
                    }
                    else {
                        $("#" + formField + " option[value='" + fieldValue + "']").prop('selected', true);  
                    }      
                }                 
            }                           
        });        
    });
    
    $(".create-dataset").submit(function(e) {
        e.preventDefault();        
        
        /* Formular-Vollständigkeit prüfen */
        var flag = false;
        
        /*$(".metadata").each(function(i, obj) {
            if($(this).prop('tagName') == 'INPUT' || $(this).prop('tagName') == 'TEXTAREA') {
                if($(this).val() == '') flag = true; 
            }    
        });*/
        
        if ($("#title").val() != "" && $("#source").val() != "") flag = true;
        else flag = false;
        
        var dataset = {
            name : $("#title").val().replace(/\s/g, '').toLowerCase(),
            title : $("#title").val(),
            author : $("#author").val(),
            author_email : $("#email-author").val(),
            maintainer : $("#maintainer").val(),
            maintainer_email : $("#email-maintainer").val(),
            license_id : $("license option:selected").text(),
            notes : $("#description").val(),
            type : $("data-format option:selected").text(),
            tags : {
                
            },
            extras : {
                size : $("#file-size").val()     
            },
            owner_org : $("#organisation").val().toLowerCase(),
            owner_display : $("#organisation").val(),
            resources : $("#source").prop('files')[0]['name']
        };
        
        var data = new FormData();
        
        for (var tag in dataset) {
            data.append(tag, dataset[tag]);
        }

        /* Verbindung zu CKAN aufbauen */
        if (flag) {
            $.ajax({
                url: '././PHP/API/upload.php',
                type: 'post',
                data: data, 
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(data) {
                    $(".modal-container.information h2").html(data);  
                    $(".modal, .modal-container.information").addClass('in');
            
                    setTimeout(function() {
                        $(".modal, .modal-container").removeClass('in');    
                    }, 3000); 
                },
                error: function() {
                    $(".modal-container.information h2").html('Wählen Sie eine Datei aus und geben Sie den Titel an');  
                    $(".modal, .modal-container.information").addClass('in');  
            
                    setTimeout(function() {
                        $(".modal, .modal-container").removeClass('in');    
                    }, 3000); 
                }
            });   
        }               
    });
});