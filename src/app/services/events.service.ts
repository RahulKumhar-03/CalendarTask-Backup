import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FestivalEvent } from '../event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/events'
  constructor(private http: HttpClient) { }

  getAllEvents():Observable<FestivalEvent[]>{
    return this.http.get<FestivalEvent[]>(this.apiUrl)
  }

  createEvent(eventData: FestivalEvent):Observable<FestivalEvent>{
    return this.http.post<FestivalEvent>(this.apiUrl, eventData);
  }

  updateEvent(eventId:string ,eventData: FestivalEvent):Observable<FestivalEvent>{
    return this.http.put<FestivalEvent>(`${this.apiUrl}/${eventId}`, eventData);
  }

  deleteEvent(eventId: number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }
}

