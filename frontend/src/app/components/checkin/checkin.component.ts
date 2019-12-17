import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { QrScannerComponent } from 'angular2-qrscanner';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';

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

  imageWidth = 640;
  imageHeight = 480;
  video;

  constructor(private activeRoute: ActivatedRoute,
    private eventService: EventService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar) { }

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

              this.video = document.querySelectorAll('video')
              this.imageHeight = this.video[0].scrollHeight;
              this.imageWidth = this.video[0].scrollWidth;
            }
          });

          this.qrScannerComponent.capturedQr.subscribe(result => {
            this.spinner.show();
            //decript....

            setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.spinner.hide();
            }, 5000);

            this.eventService.checkin("5def645deda49811e449789d", "5dee0d9abebf9530983aa2b0").subscribe((data)=>{

              this.spinner.hide();
   
              if (data.results == -1) {             //qrcode invalid
                this.openSnackBar("qrcode invalid,please scan again")
              } else if (data.results == -2) {       //eventId invalid
                this.openSnackBar("event invalid,please scan again")
              } else if (data.results == -3) {       //MongoDB update error
                this.openSnackBar("database error")
              } else if (data.results == 1) {        //first time checkin
                this.openSnackBar("Welcome "+data.username)
                //print.....



              } else {
                this.openSnackBar("Welcome back "+data.username)
              }

            })

            this.qrScannerComponent.startScanning(this.selectedvideoDevice);
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


  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
    });
  }


}
