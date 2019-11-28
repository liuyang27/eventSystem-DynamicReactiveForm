import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventComponent } from './components/event/event.component';
import { AddeventComponent } from './components/addevent/addevent.component';

const routes: Routes = [
  { path: '', component: EventComponent },
  { path: 'addevent', component: AddeventComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
