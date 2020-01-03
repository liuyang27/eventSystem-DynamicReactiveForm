import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-checkindialog',
  templateUrl: './checkindialog.component.html',
  styleUrls: ['./checkindialog.component.scss']
})



export class CheckindialogComponent implements OnInit {
  createdCode: any;
  questionList;
  _width = 172;
  _height = 280;
  pdfDocGenerator: any;

  popupDuration;
  counterId;

  constructor(public dialogRef: MatDialogRef<CheckindialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log(this.data)
    this.questionList = this.data.PreEventSurvey;
    this.popupDuration=5;
    this.counterId=setInterval(() => { this.popupDuration= this.popupDuration - 1 }, 1000);

  }

  ngOnDestroy(){
    if(this.counterId){
      clearInterval(this.counterId);
    }
  }

  generatePdf() {
    const documentDefinition = {
      pageSize: {
        width: this._width,
        height: this._height,
      },
      pageMargins: [5, 5, 5, 5],

      content: [
        {
          text: this.data.user.Name,
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          qr: JSON.stringify(this.data.user),
          fit: '120',
          alignment: 'center',
          margin: [0, 5, 0, 0],
        },
        {
          text: this.data.user.Company,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 5, 0, 0],
        },
      ]
    };

    if (this.questionList) {
      for (let q in this.questionList) {
        if (this.questionList[q].printable == true) {
          var num = parseInt(q) + 1;
          if (this.questionList[q].answerPrint[0] != null) {
            var answer = "Q" + num + ": ";
            for (var i = 0; i < this.questionList[q].answerPrint.length; i++) {
              if (i == this.questionList[q].answerPrint.length - 1) {
                answer = answer + this.questionList[q].answerPrint[i];
              } else {
                answer = answer + this.questionList[q].answerPrint[i] + ", ";
              }
            }
            documentDefinition.content.push({
              text: answer,
              fontSize: 10,
              alignment: 'left',
              margin: [0, 5, 0, 0],
            });
          }

        }
      }
    }

    const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(documentDefinition).print({}, win);
    setTimeout( () => { win.close(); }, 10000);
  
  }

  closeDialog(){
    this.dialogRef.close();
  }




}
