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
  eventdata:any;
  constructor(private activeRoute:ActivatedRoute,
              private eventService:EventService) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(params => {
      this.eventId = params.get("eid");
      this.getEvent(this.eventId)
    })
  }

  getEvent(id){
    this.eventService.getEventById(id).subscribe((data)=>{
      console.log(data.results);
      this.eventdata=data.results;
    })
  }

}
