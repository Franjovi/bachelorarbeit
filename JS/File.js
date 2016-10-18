/*define file class*/
function File(filePointer, fileName) {
    this.filePointer = filePointer;
    this.fileName = fileName;   
    this.fileStream = [];
    this.fileType;
    this.fileSize;
    this.modifiedDate;
    this.metaTags = [];   
}

File.prototype.set = function(member, value) {
    this.member = value;
};

File.prototype.get = function(member) {
    return this.member;
};

File.prototype.getFileName = function() {
    var fileTitle = this.fileName.split("\\")[2].split(".")[0]; 
    fileTitle = fileTitle.charAt(0).toUpperCase() + fileTitle.slice(1);

    $("#suggestion-title").append('<optgroup label="Technische Informationen"><option value="' + fileTitle + '">' + fileTitle + '</option></optgroup>');    
};

File.prototype.getFileSize = function(byteStream) {
    file.fileSize = byteStream.byteLength;
    var returnedFileSize = file.fileSize/1000/1000 + " Megabyte";
    
    $("#suggestion-file-size").append('<optgroup label="Technische Informationen"><option value="' + returnedFileSize + '">' + returnedFileSize + '</option></optgroup>');
}  

File.prototype.getFileType = function(byteStream, header) {
    header = header.toUpperCase(); 
                                      
    switch(header) {
        case "377ABCAF": file.fileType = "7Z";
                            break;
        case "3C21444F": file.fileType = "HTML";
                         break;
        case "FFD8FFE0 ": 
        case "FFD8FFE1": file.fileType = "JPG";
                         break;    
        case "25504446": file.fileType = "PDF";
                         break;
        case "89504E47": file.fileType = "PNG"; 
                         break;
        case "25215053": file.fileType = "PS";
                          break;
        case "D0CF11E0": file.fileType = "XLS";
                         break;
        /* Leider auch ZIP */
        case "504B0304": file.fileType = "XLSX";
                         break;
        case "3C3F786D": file.fileType = "XML";
                         break;
        default: file.fileType = "undefined";                                                 
    }
    
    if(file.fileType == "undefined") {                           
        var firstStreamLine = byteStream.subarray(0, byteStream.indexOf(10));   
        
        /* ASCII-Zeichenkette in lesbaren String umwandeln */
        var firstLine = String.fromCharCode.apply(null, firstStreamLine);      
              
        if((firstLine.indexOf("{") > -1 || firstLine.indexOf("[") > -1) && (firstLine.indexOf(",") < 0)) file.fileType = "JSON";
        else if(firstLine.indexOf("<") > -1 && firstLine.indexOf("{") < 0) file.fileType = "XML";
        else if((firstLine.indexOf(",") > - 1 || firstLine.indexOf(";") > - 1 || firstLine.indexOf("|") > - 1)) file.fileType = "CSV";
                
        if(file.fileType == "undefined") file.fileType = file.fileName.substr(file.fileName.lastIndexOf('.') + 1).toUpperCase();    
    }
    
    $("#suggestion-data-format").append("<optgroup label='Technische Informationen'><option selected value='" + file.fileType + "'>" + file.fileType + "</option></optgroup>");
}  