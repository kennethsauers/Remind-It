import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CreateReminderInformation, CreateReminderResponse } from '../schema/reminders';

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
}
