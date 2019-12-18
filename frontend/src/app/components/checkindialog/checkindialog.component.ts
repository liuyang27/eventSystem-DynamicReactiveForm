import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'app-checkindialog',
  templateUrl: './checkindialog.component.html',
  styleUrls: ['./checkindialog.component.scss']
})



export class CheckindialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CheckindialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
