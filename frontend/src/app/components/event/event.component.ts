import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';


export interface EventElement {
  eid:string;
  name: string;
  dayofweek: string;
  capacity: number;
  teacher: string;
  introdction:string;
  allow:[string];
}


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})




export class EventComponent implements OnInit {
  eventlist:EventElement[]=[]
  displayedColumns: string[] = ['eid', 'name', 'dayofweek', 'allow','capacity','teacher','introdction','register'];
  // displayedColumns: string[] = ['eid', 'name'];
  dataSource
  // dataSource = new MatTableDataSource(this.eventlist);

  constructor(private http: HttpClient) { }

  ngOnInit() {
   
    this.getEvents().subscribe(
      (data)=>{
          var d = data["results"]
          for(var event of data["results"]){
            var e:EventElement= {
              eid:event["cid"],
              name: event["name"],
              dayofweek: event["dayofweek"],
              capacity: event["number"],
              teacher: event["teacher"],
              introdction:event["briefintro"],
              allow:event["allow"],
            }
            this.eventlist.push(e);
          }
          this.dataSource=new MatTableDataSource(this.eventlist);
          // console.log(this.eventlist)
      }

    )

  }

  getEvents() {
    return this.http.get('http://localhost:3000');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  register(id){
    alert(id)
  }

}
