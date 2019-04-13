import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

import { CreateReminderInformation, CreateReminderResponse } from '../schema/reminders';
import { AuthenticationService } from '../services/authentication.service';
import { EventService } from '../services/event.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-reminder',
  templateUrl: './create-reminder.component.html',
  styleUrls: ['./create-reminder.component.css']
})
export class CreateReminderComponent implements OnInit {
  createReminderForm = new FormGroup({
    name: new FormControl('birthday party my dude', [
      Validators.required,
      Validators.maxLength(32)
    ]),
    description: new FormControl('call your friends', [
      Validators.required,
      Validators.maxLength(32767)
    ]),
    dueDate: new FormControl(new Date(), [
      Validators.required,
      Validators.maxLength(16)
    ]),
    time: new FormControl('', Validators.maxLength(16)),
    isPublic: new FormControl(false),
    isRepeating: new FormControl(false)
  });

  private _success = new Subject<String>();
  success: Boolean;
  message: String;

  constructor(private authService: AuthenticationService,
              private eventService: EventService,
              private router: Router) { }

  ngOnInit() {
    this._success.subscribe( (msg) => { this.message = msg });
    this._success.pipe(
      debounceTime(5000)
    ).subscribe( () => this.success = null );
  }

  getDateFromPicker(date: any, time?: any): Date {
    if (time.hour)
      return new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
    else
      return new Date(date.year, date.month - 1, date.day);
  }

  onSubmit() {
    const reminderInformation: CreateReminderInformation = {
      userId: this.authService.getUser().id,
      userName: this.authService.getUser().username,
      isPublic: this.createReminderForm.get('isPublic').value,
      repeats: this.createReminderForm.get('isRepeating').value,
      name: this.createReminderForm.get('name').value,
      description: this.createReminderForm.get('description').value,
      dueDate: this.getDateFromPicker(this.createReminderForm.get('dueDate').value, 
                                      this.createReminderForm.get('time').value)
    };

    this.eventService.addReminder(this.authService.getToken(), reminderInformation).subscribe( (res: CreateReminderResponse) => {
      console.log(res.event);
      this.success = res.success;
      this._success.next(res.msg);
    });
  }
}
