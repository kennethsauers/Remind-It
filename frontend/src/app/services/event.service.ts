import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CreateReminderInformation, CreateReminderResponse, Reminder } from '../schema/reminders';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  /// TODO: Change according to your setup
  readonly ApiUrl = 'http://localhost:3000/events/';
  //readonly ApiUrl = 'https://themeanteam.site/events/';

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

  getMyReminders(token: string) {
    return this.getEvents('my', token);
  }

  getPublicEvents(token: string): Observable<Reminder[]> {
    return this.getEvents('all', token);
  }

  public getEvents(kind: string, token: string): Observable<Reminder[]> {
    const HttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };

    return this.http.get<Reminder[]>(this.ApiUrl + 'get/' + kind, HttpOptions).pipe(      
      map((data: any[]) => data.map((item: any) => new Reminder(
        item.name,
        item.description,
        item.dueDate,
        item._id
      )))
    );
  }
}
