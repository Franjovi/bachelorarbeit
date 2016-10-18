function analyseXLS() {
    var reader = new FileReader();
    
    reader.onload = function(e) {
        arrayContent = reader.result; 

        var workbook = XLS.read(arrayContent, {type:"binary"});
        
        var x = to_json(workbook);
        console.log(x);
    }
  
    reader.readAsBinaryString(file.filePointer); 
    
    //var x = ABC.toBinary(suggestion.fileAsString);
    //var workbook = XLS.read(x, {type:"binary"});
}

var ABC = {
  toAscii: function(bin) {
    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
      return String.fromCharCode(parseInt(bin, 2))
    })
  },
  toBinary: function(str, spaceSeparatedOctets) {
    return str.replace(/[\s\S]/g, function(str) {
      str = ABC.zeroPad(str.charCodeAt().toString(2));
      return !1 == spaceSeparatedOctets ? str : str + " "
    })
  },
  zeroPad: function(num) {
    return "00000000".slice(String(num).length) + num
  }
};

function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var csv = XLS.utils.make_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
    }
  });
  return result.join("\n");
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  return result;
}