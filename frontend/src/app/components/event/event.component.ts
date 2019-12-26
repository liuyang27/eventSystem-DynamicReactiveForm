import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})




export class EventComponent implements OnInit {

  displayedColumns: string[] = ['name', 'eventformat', 'category','date','venue','details'];
  dataSource;
 

  constructor(private http: HttpClient,
              private eventService:EventService,
              private router:Router) { }

  ngOnInit() {
    this.loadPage();
  }

  getEvents() {
    return this.http.get('http://localhost:3000');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showDetails(id){
    this.router.navigate(['/event',id]);
  }

  showEdit(id){
    this.router.navigate(['/editevent',id]);
  }

  onDelete(id){
    if(!confirm("Are you sure to delete this event? ")) {
      return;
    }
    this.eventService.deleteEventById(id).subscribe((data)=>{
      if(data.results==1){
        alert("Event deleted");
        this.loadPage();
        
      }else{
        alert("error...");
      }
    })  
  }

  loadPage(){
    this.getEvents().subscribe(
      (data)=>{
          this.dataSource=new MatTableDataSource(data["results"]);
      })
  }

}
