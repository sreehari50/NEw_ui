const fs = require('fs');
var tempFile="/home/mathul/Desktop/test/sFri Jun 07 2019 11:49:53 GMT+0530 (IST).pdf";
fs.readFile(tempFile, function (err,data){
   response.contentType("application/pdf");
   response.send(data);
});