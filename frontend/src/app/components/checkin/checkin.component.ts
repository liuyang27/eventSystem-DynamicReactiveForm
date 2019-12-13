import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { QrScannerComponent } from 'angular2-qrscanner';

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

  constructor(private activeRoute: ActivatedRoute,
    private eventService: EventService) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(params => {
      this.eventId = params.get("eid");
      this.eventService.getEventById(this.eventId).subscribe((data) => {
        this.eventdata = data.results;

        if(this.eventdata != '-1'){
          this.qrScannerComponent.getMediaDevices().then(devices => {
            for (const device of devices) {
              if (device.kind.toString() === 'videoinput') {
                this.videoDevices.push(device);
              }
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
            console.log(result);

            this.qrScannerComponent.startScanning(this.selectedvideoDevice);
          })
        }

       



      })




     

      
    })
  }



}
