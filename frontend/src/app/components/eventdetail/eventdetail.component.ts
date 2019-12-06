import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.scss']
})
export class EventdetailComponent implements OnInit {

  eventId:string;
  eventdata=null;

  eventStartTime:string;
  counterid;
 

  constructor(private activeRoute:ActivatedRoute,
              private eventService:EventService) { }

ngOnInit() {

    this.activeRoute.paramMap.subscribe(params => {
      this.eventId = params.get("eid");
      this.getEvent(this.eventId)
    })
    
  }

  ngOnDestroy(){
    if(this.counterid){
      clearInterval(this.counterid);
    }
  }

  getEvent(id){
    this.eventService.getEventById(id).subscribe((data)=>{
      console.log(data.results);
      this.eventdata = data.results;
      this.eventStartTime=this.getEventTime(this.eventdata);
      this.counterid=setInterval(() => { this.update(this.eventStartTime) }, 1000);
    })
  }

  getEventTime(event){
    var date:string=event.dateFrom;
    var timing:string=event.timingFrom;

    var splitTiming=timing.split(" ")[0];
    var unit=timing.split(" ")[1];

    var hour=splitTiming.split(":")[0];
    var min=splitTiming.split(":")[1];

    if(unit=="PM"){
      hour=(parseInt(hour)+12).toString();
    }
    if(hour.length<2){
      hour="0"+hour;
    }
  
    return date.substr(0,11)+hour+":"+min+":00"
  }


update(eventStartTime) {
  var timer:any=document.getElementById("timer");
  if ( timer.style.opacity !== 1 ) {
    timer.style.opacity = 1;
  }
  
  var currentDate:any = new Date();
  var eventDate:any = new Date(eventStartTime);
  var differenceDate = eventDate - currentDate;
  
 
  timer.days = document.querySelectorAll(".days .timer__number")[0];
  timer.hours = document.querySelectorAll(".hours .timer__number")[0];
  timer.minutes = document.querySelectorAll(".minutes .timer__number")[0];
  timer.seconds = document.querySelectorAll(".seconds .timer__number")[0];

  if(differenceDate>0){
    timer.days.innerHTML = this.getTimeRemaining(differenceDate,86400000, 1);
    timer.hours.innerHTML = this.getTimeRemaining(differenceDate,3600000, 24);
    timer.minutes.innerHTML = this.getTimeRemaining(differenceDate,60000, 60);
    timer.seconds.innerHTML = this.getTimeRemaining(differenceDate,1000, 60);
  }else{
    timer.days.innerHTML = "00";
    timer.hours.innerHTML = "00";
    timer.minutes.innerHTML = "00";
    timer.seconds.innerHTML = "00";
  }

}



/*
* calculate remaining time based on a unit of time
*/
getTimeRemaining(difference, timeUnit, divisor ) {
  var n;
  if ( divisor == 1 ) {
    n = Math.floor(difference / timeUnit );
  }
  else {
    n = Math.floor((difference / timeUnit) % divisor );
  }
  
  if ( String(n).length < 2 ) {
    n = "0" + n;
  }
  return n;
}





}
