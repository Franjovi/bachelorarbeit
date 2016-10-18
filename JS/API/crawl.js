function crawlPortal() {     
    $.ajax({
        url: '././PHP/API/crawl.php',
        dataType: 'json',
        success: function(data) {            
            $(".modal-container.information h2").html('Der Datensatz ist bereit zum Upload');  
            $(".modal, .modal-container.information").addClass('in');
            
            setTimeout(function() {
                $(".modal, .modal-container").removeClass('in');    
            }, 3000); 
            
            suggestion.displayDBSuggestions(data);
        },
        error: function() {
            $(".modal-container.information h2").html('Bitte loggen Sie sich ein');  
            $(".modal, .modal-container.information").addClass('in');  
            
            setTimeout(function() {
                $(".modal, .modal-container").removeClass('in');    
            }, 3000); 
        }
    });
}