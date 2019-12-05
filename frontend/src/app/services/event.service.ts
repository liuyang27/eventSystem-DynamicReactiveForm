import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  addNewEvent(event):Observable<any>{
    return this.http.post("http://localhost:3000/event/",event);
  }

  deleteEventById(eid):Observable<any>{
    var res = this.http.delete("http://localhost:3000/event/"+eid);
    return res;
  }

  getEventById(eid):Observable<any>{
    var res = this.http.get("http://localhost:3000/event/"+eid);
    return res;
  }

}
