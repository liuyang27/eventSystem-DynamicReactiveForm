import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import * as PDFDocument  from 'pdfkit';
// import * as QRCode  from 'qrcode';
// import * as blobStream   from 'blob-stream';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-checkindialog',
  templateUrl: './checkindialog.component.html',
  styleUrls: ['./checkindialog.component.scss']
})



export class CheckindialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CheckindialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
  }

  generatePdf(){
    const documentDefinition = { 
      pageSize: {
        width: 172,
        height: 280,
      },
      pageMargins: [ 5, 5, 5, 5 ],
   
      content: [
        { text: this.data.user.Name, 
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        { qr: JSON.stringify(this.data.user),
          fit: '120',
          alignment: 'center',
          margin: [0, 5, 0, 0],
        },
        { text: this.data.user.Company, 
          fontSize: 12,
          alignment: 'center',
          margin: [0, 5, 0, 0],
        },
      ] 
    };






    documentDefinition.content.push( { text: this.data.user.Company, 
      fontSize: 12,
      alignment: 'center',
      margin: [0, 5, 0, 0],
    },);

    pdfMake.createPdf(documentDefinition).open();
  }
 
  
   
  

  // printQrcode(qrCodeData,questionList){
  //     var qrCodeString=JSON.stringify(qrCodeData)
  //     var _width = 172 //width ~2.4 inch
  //     var _height = 280 // height ~3.9 inch
  //     const doc = new PDFDocument({
  //       layout: 'portrait',
  //       size: [_width, _height],
  //       margin: 20,
  //     });
  //     QRCode.toFile( 'assets/foo.jpeg',JSON.stringify(qrCodeData), function (err, url) {
  //       if (err) {
  //         console.log("printing err...");
  //         console.log(err)
  //         return;
  //       }
  //       if (url) {
  //         doc.fontSize(13);
  //         const stream = doc.pipe(blobStream());
  //         // doc.pipe(fs.createWriteStream('qrCodePDF/' + qrCodeData.Email + '.pdf'));
  //         doc.font('Times-Bold').text(`${qrCodeData.Name}`, 0, 10, { width: _width, align: 'center' });
  //         // var img = new Buffer(url.split(',')[1] || "", 'base64');
  //         doc.image('assets/foo.jpeg', (_width / 2) - (120 / 2), null, {
  //           fit: [120, 120],
  //           align: 'center',
  //           valign: 'center'
  //         });
  //         doc.fontSize(12);
  //         doc.font('Times-Roman').text(`${qrCodeData.Company}`, 0, 145, { width: _width, align: 'center' })
    
  //         doc.fontSize(10);
  //         doc.moveDown();
  //         if (questionList) {
  //           for (let q in questionList) {
  //             if (questionList[q].printable == true) {
  //               var num = parseInt(q) + 1;
  //               if (questionList[q].answerPrint[0] != null) {
  //                 doc.text(`Q${num}:`, { width: _width, align: 'left', continued: true })
  //                 for (var i = 0; i < questionList[q].answerPrint.length; i++) {
  //                   if (i == questionList[q].answerPrint.length - 1) {
  //                     doc.text(questionList[q].answerPrint[i], { width: _width, align: 'left' })
  //                   } else {
  //                     doc.text(questionList[q].answerPrint[i] + ", ", { width: _width, align: 'left', continued: true })
  //                   }
  //                 }
  //               }
    
  //             }
  //           }
  //         }
  //         doc.end();

  //         stream.on('finish', function() {
  //           // get a blob you can do whatever you like with
  //           const blob = stream.toBlob('application/pdf');
  //           console.log(blob)


  //         })
  //       }
  //     })
  //     console.log(JSON.stringify(qrCodeData))
  // }

}
