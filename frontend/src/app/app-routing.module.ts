import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './components/event/event.component';
import { AddeventComponent } from './components/addevent/addevent.component';
import { EventdetailComponent } from './components/eventdetail/eventdetail.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { EditeventComponent } from './components/editevent/editevent.component';

const routes: Routes = [
  { path: '', component: EventComponent },
  { path: 'addevent', component: AddeventComponent },
  { path: 'event/:eid', component: EventdetailComponent },
  { path: 'event/:eid/checkin', component: CheckinComponent },
  { path: 'editevent/:eid', component:EditeventComponent},
  { path: '**',  redirectTo: '',pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
