import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { QrScannerComponent } from 'angular2-qrscanner';
import { NgxSpinnerService } from "ngx-spinner";

import { MatDialog } from '@angular/material/dialog';
import { CheckindialogComponent } from '../checkindialog/checkindialog.component';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckinComponent implements OnInit {
  @ViewChild('scannerArea', { static: true }) qrScannerComponent: QrScannerComponent;

  selectedvideoDevice: any;
  videoDevices: MediaDeviceInfo[] = [];

  eventId: string;
  eventdata = null;
  dualCamera = false;
  dialogRef: any;


  constructor(private activeRoute: ActivatedRoute,
    private eventService: EventService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog) { }
  

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(params => {
      this.eventId = params.get("eid");
      this.eventService.getEventById(this.eventId).subscribe((data) => {
        this.eventdata = data.results;

        if (this.eventdata != '-1') {
          this.qrScannerComponent.getMediaDevices().then(devices => {
            for (const device of devices) {
              if (device.kind.toString() === 'videoinput') {
                this.videoDevices.push(device);
              }
            }

            if (this.videoDevices.length > 1) {
              this.dualCamera = true;
            } else {
              this.dualCamera = false;
            }

            if (this.videoDevices.length > 0) {
              let choosenDev;
              for (const dev of this.videoDevices) {
                if (dev.label.includes('front')) {
                  choosenDev = dev;
                  break;
                }
              }
              if (choosenDev) {
                this.qrScannerComponent.chooseCamera.next(choosenDev);
                this.selectedvideoDevice = choosenDev;
              } else {
                this.qrScannerComponent.chooseCamera.next(this.videoDevices[0]);
                this.selectedvideoDevice = this.videoDevices[0];
              }

            }
          });

          this.qrScannerComponent.capturedQr.subscribe(result => {
            this.spinner.show();
            var bytes  = CryptoJS.AES.decrypt(result.toString(),'hello world');
            var decyptedQRcode = bytes.toString(CryptoJS.enc.Utf8);   

            setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.spinner.hide();
            }, 5000);

            this.eventService.checkin(decyptedQRcode, this.eventId).subscribe((data) => {
              this.spinner.hide();
              var canvas = document.querySelectorAll('canvas')
              canvas[0].style.display = 'none'

              this.openDialog(data.results,data.user,data.PreEventSurvey);
            })

          })
        }

      })
    })
  }


  flipCamera() {
    if (this.selectedvideoDevice == this.videoDevices[1]) {
      this.selectedvideoDevice = this.videoDevices[0]
    } else {
      this.selectedvideoDevice == this.videoDevices[1]
    }
    this.qrScannerComponent.chooseCamera.next(this.selectedvideoDevice);
  }

  openDialog(code,user,PreEventSurvey): void {
    this.dialogRef = this.dialog.open(CheckindialogComponent, {
      height: '60%',
      width: '80%',
      data: {code: code, user: user,PreEventSurvey:PreEventSurvey}
    });
    // setTimeout(() => {
    //   this.dialogRef.close();
    //   this.qrScannerComponent.startScanning(this.selectedvideoDevice);
    // }, 1000);
  }

}
