import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CreateReminderInformation, CreateReminderResponse, Reminder, UpdateEventResponse, DeleteReminderResponse } from '../schema/reminders';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /// TODO: Change according to your setup
  readonly ApiUrl = 'https://localhost/events/';
  //readonly ApiUrl = 'https://themeanteam.site/events/';

  public onEventLoad: EventEmitter<Reminder> = new EventEmitter<Reminder>();
  public onEventListLoad: EventEmitter<Reminder[]> = new EventEmitter<Reminder[]>();

  /**
   * @param http HttpClient injection to make API requests
   */
  constructor(private http: HttpClient) { }

  /**
    * Makes call to the Api and returns an CreateReminderResponse
    * @param token The user's authentication token to authenticate the api call
    * @param reminder CreateReminderInformation object with the reminder data
    */
  addReminder(token: string, reminder: CreateReminderInformation) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post<CreateReminderResponse>(this.ApiUrl + 'create', reminder, HttpOptions);
  }

  updateEvent(token: string, event: Reminder) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    this.http.put<UpdateEventResponse>(this.ApiUrl + 'update/' + event._id, event, HttpOptions).subscribe(res => {
      if (res.success) {
        // Update event and event list caches
        res.event.dueDate = new Date(res.event.dueDate);
        this.onEventLoad.emit(res.event);
        this.getMyReminders(token);
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  deleteEvent(token: string, event: Reminder) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    this.http.delete<DeleteReminderResponse>(this.ApiUrl + 'delete/' + event._id, HttpOptions).subscribe(res => {
      if (res.success) {
        console.log(res.msg);
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  getEventInformation(token: string, id: string) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    this.http.get<Reminder>(this.ApiUrl + 'get/id/' + id, HttpOptions).subscribe(event => {
      if (event.name != null) {
        event.dueDate = new Date(event.dueDate);
        event.lat = +event.lat;
        event.lng = +event.lng;

        this.onEventLoad.emit(event);
      }
    }, err => {
      console.log(err);
      return false;
    });
  }

  getMyReminders(token: string) {
    return this.getEvents('my', token);
  }

  getPublicEvents(token: string) {
    return this.getEvents('all', token);
  }

  public getEvents(kind: string, token: string) {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    return this.http.get<Reminder[]>(this.ApiUrl + 'get/' + kind, HttpOptions).pipe(
      map((data: any[]) => data.map((item: any) => new Reminder(
        item._id,
        item.userID,
        item.isPublic,
        item.name,
        item.description,
        new Date(item.dueDate),
        item.repeats,
        item.isComplete,
        +item.lat,
        +item.lng,
        item.repeatUnit,
        item.repeatConst,
        item.mustBeNear
      )))
    ).subscribe(events => {
      if (events != null) {
        this.onEventListLoad.emit(events);
      }
    }, err => {
      console.log(err);
      return false;
    });
  }
}
