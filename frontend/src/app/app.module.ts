import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventComponent } from './components/event/event.component';

import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { AddeventComponent } from './components/addevent/addevent.component';
import { ReactiveFormsModule } from '@angular/forms'

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { EventdetailComponent } from './components/eventdetail/eventdetail.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { NgxSpinnerModule } from "ngx-spinner";
import { CheckindialogComponent } from './components/checkindialog/checkindialog.component';
import { EditeventComponent } from './components/editevent/editevent.component';


@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    AddeventComponent,
    EventdetailComponent,
    CheckinComponent,
    CheckindialogComponent,
    EditeventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    NgQrScannerModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[CheckindialogComponent]
})


export class AppModule { }
