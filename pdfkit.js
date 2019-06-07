var fs = require('fs');
var PDFDocument = require ('pdfkit'); // install -> npm install pdfkit
var Asset =  require('/home/mathul/fabric-dev-servers/land-registry/getAsset');
var hist=require('/home/mathul/fabric-dev-servers/land-registry/getpdf')
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//  Mongodb query ....


// Find element from batabase.



var pdf = new PDFDocument({
    size : 'LEGAL',
    info: {
        Title: 'Distributed Contracts',
        Author: 'George Jose',
    }
});


// insert image
pdf.image('/home/mathul/fabric-dev-servers/New folder/logo.jpg', 0, 15, {width: 300})
 
  landid=process.argv[2];
  
// Write content to pdf file
  Asset.landdetails(landid).then(res=>{
    hist.landdetails(landid).then(res1=>{
  console.log(res1[0]);
  console.log(res[0]);
	deed_land_id = res1[0].land_id;
	deed_seller = res1[0].seller;
  deed_buyer = res1[0].buyer;
  deed_time=res1[0].time;
  deed_buyeraadhar=res1[0].buyerid;
  deed_selleraadhar=res1[0].sellerid;
  deed_name=res1[0].seller;
	//deed_gender = res[0].gender;
	//deed_phone = res[0].phone;
	deed_coordinate_one = res[0].Coordinate_one;
	deed_coordinate_two = res[0].Coordinate_two;
	deed_area = res[0].area;
      console.log(deed_land_id);


var pdfname=deed_seller+ new Date();
pdf.text('\n\n\n\n\n LAND OWNERSHIP TRANSFER CERTIFICATE \n\n\n\n  The transfer of the land (land_id :'+  deed_land_id +') is made and effective. ['+ deed_time + '] \n\n\n  Seller : '+ deed_seller  +'\n Aadhar:'+deed_selleraadhar +'\n\n\n Buyer : '+ deed_buyer +'\n' +' \n\n\n Property details : \n\n\n  The ownership of the land ( land_id : '+ deed_land_id +') owned by (Seller name : '+ deed_seller +')is transferred to ( Buyer : '+ deed_buyer +' Aadhar:'+deed_selleraadhar +') with effect from ('+ deed_time +').\n All the legal rights of the above land now belongs to ( Buyer : '+ deed_buyer +'\n Aadhar:'+deed_buyeraadhar +')');

pdf.pipe(
    fs.createWriteStream('/home/mathul/Desktop/test/'+pdfname+'.pdf')
  ).on('finish', function () {
      console.log('edited and closed');
      process.stdout=pdfname;
      process.exit(0);
    });
  
  // Close PDF and write file.
  pdf.end();
 // process.exit(0);  
}).catch((error)=>{
  console.log(error);
  //bnConnection.disconnect();
});
}).catch((error)=>{
  console.log(error);
 // bnConnection.disconnect();
});